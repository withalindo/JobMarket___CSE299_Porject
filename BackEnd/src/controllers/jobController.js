import Job from "../models/Job.js";
import { attachCompanyInfo, escapeRegex } from "../utils/helpers.js";

// Get all jobs, with optional search and category filter, and attach companyLogo and companyName
export const getJobs = async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    if (typeof search === "string" && search.trim() !== "") {
      const pattern = escapeRegex(search.trim());
      filter.$or = [
        { title: { $regex: pattern, $options: "i" } },
        { company: { $regex: pattern, $options: "i" } },
        { location: { $regex: pattern, $options: "i" } }
      ];
    }
    if (typeof category === "string" && category !== "" && category !== "All") {
      // Partial, case-insensitive: "Engineer" also finds "Engineering".
      filter.category = { $regex: escapeRegex(category), $options: "i" };
    }

    const jobs = await Job.find(filter).sort({ postedAt: -1 });
    res.json(await attachCompanyInfo(jobs));
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};
