import Company from "../models/Company.js";

// Makes user input safe to embed in a RegExp (so "C++" searches instead of throwing a 500).
export const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Never send credentials or OAuth ids to the browser.
export const EMPLOYEE_PUBLIC_FIELDS = "-password -googleId -linkedinId -__v";
export const COMPANY_PUBLIC_FIELDS = "-password -googleId -linkedinId -__v";

// Adds companyName / companyLogo to each job with a single company query (instead of one per job).
export const attachCompanyInfo = async (jobs) => {
  const names = [...new Set(jobs.map((job) => job.company).filter(Boolean))];
  const companies = names.length
    ? await Company.find({ companyName: { $in: names } }).select("companyName companyLogo")
    : [];
  const byName = new Map(companies.map((company) => [company.companyName, company]));

  return jobs.map((job) => {
    const company = byName.get(job.company);
    return {
      ...job.toObject(),
      companyName: company?.companyName || job.company || "Company Name",
      companyLogo: company?.companyLogo || "",
    };
  });
};

// Employees whose profile has been filled in (sign-up alone only creates username/email).
export const COMPLETED_PROFILE = { fullname: { $exists: true, $nin: ["", null] } };
