import Company from "../models/Company.js";
import { COMPANY_IMAGE_DIR } from "../config/paths.js";
import { discardUpload, removeStoredFile } from "../utils/files.js";

const FIELDS = ["phoneNumber", "address", "district", "description"];

// Saves the "Company Information" step (and later profile edits) for the logged-in company.
// Only the fields that were sent are changed, so sending just a new logo is fine.
export const addCompanyInfo = async (req, res) => {
  try {
    const company = await Company.findById(req.session.user);
    if (!company) {
      await discardUpload(req.file);
      return res.status(404).json({ message: "Company not found" });
    }

    for (const field of FIELDS) {
      if (typeof req.body[field] === "string") company[field] = req.body[field].trim();
    }

    const previousLogo = company.companyLogo;
    if (req.file) company.companyLogo = req.file.filename;

    await company.save();
    if (req.file && previousLogo !== company.companyLogo) {
      await removeStoredFile(COMPANY_IMAGE_DIR, previousLogo);
    }

    res.status(200).json({
      message: "Company info updated successfully!",
      companyLogo: company.companyLogo || "",
    });
  } catch (err) {
    await discardUpload(req.file);
    console.error("Error saving company info:", err);
    res.status(500).json({ message: "Failed to save company information" });
  }
};
