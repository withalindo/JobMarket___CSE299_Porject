import Job from "../models/Job.js";
import Company from "../models/Company.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, category, location, Salary } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: "Job title is required" });
        }

        // The posting company is the logged-in one - that is what links a job to its logo.
        const company = await Company.findById(req.session.user);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const job = new Job({
            title: title.trim(),
            company: company.companyName,
            description: description?.trim(),
            category: category?.trim(),
            location: location?.trim(),
            Salary: Salary?.trim()
        });

        await job.save();
        res.status(201).json({ message: "Job posted successfully", job });
    }
    catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ message: "Failed to post job" });
    }
}
