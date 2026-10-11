import Employee from "../models/Employee.js";
import Job from "../models/Job.js";
import {
  attachCompanyInfo,
  escapeRegex,
  EMPLOYEE_PUBLIC_FIELDS,
  COMPLETED_PROFILE,
} from "../utils/helpers.js";

export const getHomeUserInfo = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({});
    const employee = await Employee.findById(req.session.user);
    if (!employee) return res.status(404).json({});
    res.json({
      fullname: employee.fullname,
      profileImage: employee.profileImage,
      skills: employee.skills,
      summary: employee.summary,
    });
  } catch (err) {
    console.error("Error loading home user info:", err);
    res.status(500).json({});
  }
};



//Fetching all the jobs (with the posting company's name and logo attached)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(await attachCompanyInfo(jobs));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
    console.error("Error in retrieving all jobs:", error);
  }
};


// TOP JOBS: Return all jobs with company info attached
export const getTopJobs = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json([]);
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(await attachCompanyInfo(jobs));
  } catch (err) {
    console.error("Error loading top jobs:", err);
    res.status(500).json([]);
  }
};

export const getJobsForYou = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json([]);
    const jobs = await Job.find();
    res.json(await attachCompanyInfo(jobs));
  } catch (err) {
    console.error("Error loading jobs for user:", err);
    res.status(500).json([]);
  }
};

export const getTopEmployees = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json([]);
    const user = await Employee.findById(req.session.user);
    if (!user || !user.skills) return res.json([]);

    // Skills are free text (e.g. "C++"), so escape them before turning them into patterns.
    const skills = Array.isArray(user.skills) ? user.skills : [user.skills];
    const skillsRegexArr = skills
      .filter((skill) => typeof skill === "string" && skill.trim() !== "")
      .map((skill) => new RegExp(escapeRegex(skill.trim()), "i"));
    if (skillsRegexArr.length === 0) return res.json([]);

    const employees = await Employee.find({
      ...COMPLETED_PROFILE,
      skills: { $in: skillsRegexArr },
    })
      .select(EMPLOYEE_PUBLIC_FIELDS)
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(employees);
  } catch (err) {
    console.error("Error loading top employees:", err);
    res.status(500).json([]);
  }
};

// TOP JOBS: Return jobs whose category matches any skill of the logged-in employee
export const getTopJobsBySkills = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json([]);
    const employee = await Employee.findById(req.session.user);
    if (!employee || !employee.skills) return res.json([]);

    const skills = Array.isArray(employee.skills) ? employee.skills : [employee.skills];
    const skillsArr = skills.filter((skill) => typeof skill === "string" && skill.trim() !== "");

    const jobs = await Job.find();
    // Filter jobs where job.category matches any skill
    const filteredJobs = jobs.filter(job =>
      job.category && skillsArr.some(skill => job.category.toLowerCase().includes(skill.toLowerCase()))
    );
    res.json(await attachCompanyInfo(filteredJobs));
  } catch (err) {
    console.error("Error loading jobs by skills:", err);
    res.status(500).json([]);
  }
};
