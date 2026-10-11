import fs from "node:fs/promises";
import axios from "axios";
// Import the library file directly: the package's default entry runs a self-test that reads
// ./test/data/*.pdf from the current directory and crashes when loaded as an ES module.
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Employee from "../models/Employee.js";
import { ML_SERVICE_URL } from "../config/env.js";
import { RESUME_DIR } from "../config/paths.js";
import { discardUpload, removeStoredFile } from "../utils/files.js";

const MAX_TEXT_FOR_MODELS = 20000;

const looksLikePdf = async (filePath) => {
  const handle = await fs.open(filePath, "r");
  try {
    const { buffer } = await handle.read(Buffer.alloc(5), 0, 5, 0);
    return buffer.toString("latin1") === "%PDF-";
  } finally {
    await handle.close();
  }
};

const extractResumeText = async (filePath) => {
  try {
    const data = await pdfParse(await fs.readFile(filePath));
    return (data.text || "").trim();
  } catch (err) {
    console.error("Error extracting resume text:", err.message);
    return "";
  }
};

// Asks the Python service (app.py) for the most likely skill category.
const predictSkills = async (text) => {
  try {
    const { data } = await axios.post(
      `${ML_SERVICE_URL}/predict`,
      { text: text.slice(0, MAX_TEXT_FOR_MODELS) },
      { timeout: 20000 }
    );
    return data.final_prediction || "";
  } catch (err) {
    console.error("Skill prediction unavailable:", err.message);
    return "";
  }
};

const summarizeResume = async (text) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "";
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  try {
    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [
          { parts: [{ text: `Summarize this resume in 3-4 sentences:\n${text.slice(0, MAX_TEXT_FOR_MODELS)}` }] },
        ],
      },
      // Key goes in a header so it never ends up in logged URLs or error messages.
      { headers: { "x-goog-api-key": apiKey }, timeout: 30000 }
    );
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (err) {
    console.error("Resume summary unavailable:", err.message);
    return "";
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please attach your resume as a PDF file" });
    }

    const employee = await Employee.findById(req.session.user);
    if (!employee) {
      await discardUpload(req.file);
      return res.status(404).json({ message: "Employee not found" });
    }

    // The mime type comes from the client, so also check the file really is a PDF.
    if (!(await looksLikePdf(req.file.path))) {
      await discardUpload(req.file);
      return res.status(400).json({ message: "That file is not a valid PDF" });
    }

    const resumeText = await extractResumeText(req.file.path);
    const [predictedSkills, generatedSummary] = resumeText
      ? await Promise.all([predictSkills(resumeText), summarizeResume(resumeText)])
      : ["", ""];

    // Keep what the employee already had when the ML / Gemini services are unavailable.
    if (predictedSkills) employee.skills = predictedSkills;
    employee.summary = generatedSummary || req.body.summary?.trim() || employee.summary;
    if (typeof req.body.experiences === "string") employee.experiences = req.body.experiences.trim();
    const previousResume = employee.resume;
    employee.resume = req.file.filename;
    await employee.save();
    if (previousResume !== employee.resume) await removeStoredFile(RESUME_DIR, previousResume);

    res.status(200).json({
      message: resumeText
        ? "Resume uploaded successfully!"
        : "Resume uploaded, but no text could be read from it (is it a scanned image?)",
      skills: employee.skills,
      summary: employee.summary,
      resume: employee.resume,
    });
  } catch (err) {
    await discardUpload(req.file);
    console.error("Resume upload failed:", err);
    res.status(500).json({ message: "Failed to process the resume" });
  }
};
