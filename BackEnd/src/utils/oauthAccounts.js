import Employee from "../models/Employee.js";
import Company from "../models/Company.js";

const emailFromProfile = (profile) => profile.emails?.[0]?.value;

const uniqueUsername = async (base) => {
  const root = (base || "").trim() || "user";
  let candidate = root;
  for (let n = 1; await Employee.exists({ username: candidate }); n++) {
    candidate = `${root}${n}`;
  }
  return candidate;
};

// providerField is "googleId" or "linkedinId".
// Order: already linked -> existing account with the same email (link it) -> brand new account.
export const findOrCreateEmployee = async (providerField, profile) => {
  let employee = await Employee.findOne({ [providerField]: profile.id });
  if (employee) return employee;

  const email = emailFromProfile(profile);
  if (!email) throw new Error("The sign-in provider did not return an email address");

  employee = await Employee.findOne({ email });
  if (employee) {
    employee[providerField] = profile.id;
    return employee.save();
  }

  return Employee.create({
    [providerField]: profile.id,
    username: await uniqueUsername(profile.displayName),
    email,
  });
};

export const findOrCreateCompany = async (providerField, profile) => {
  let company = await Company.findOne({ [providerField]: profile.id });
  if (company) return company;

  const email = emailFromProfile(profile);
  if (!email) throw new Error("The sign-in provider did not return an email address");

  company = await Company.findOne({ email });
  if (company) {
    company[providerField] = profile.id;
    return company.save();
  }

  return Company.create({
    [providerField]: profile.id,
    companyName: profile.displayName || email.split("@")[0],
    email,
  });
};
