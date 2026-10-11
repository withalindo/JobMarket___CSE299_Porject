import Employee from "../models/Employee.js";
import Company from "../models/Company.js";
import { UPLOADS_DIR } from "../config/paths.js";
import { EMPLOYEE_PUBLIC_FIELDS, COMPANY_PUBLIC_FIELDS } from "../utils/helpers.js";
import { discardUpload, removeStoredFile } from "../utils/files.js";

// GET /api/me - the logged-in account (employee or company), without credentials.
export const getMe = async (req, res) => {
  try {
    const { user: id, userType } = req.session;

    if (userType !== "company") {
      const employee = await Employee.findById(id).select(EMPLOYEE_PUBLIC_FIELDS);
      if (employee) return res.json({ userType: "employee", ...employee.toObject() });
    }
    if (userType !== "employee") {
      const company = await Company.findById(id).select(COMPANY_PUBLIC_FIELDS);
      if (company) return res.json({ userType: "company", ...company.toObject() });
    }
    res.status(404).json({ message: "Account not found" });
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// POST /api/profile/picture - replace the employee's profile picture.
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please choose an image to upload" });
    }

    const employee = await Employee.findById(req.session.user);
    if (!employee) {
      await discardUpload(req.file);
      return res.status(404).json({ message: "Employee not found" });
    }

    const previousImage = employee.profileImage;
    employee.profileImage = req.file.filename;
    await employee.save();
    await removeStoredFile(UPLOADS_DIR, previousImage);

    res.json({ message: "Profile picture updated", profileImage: employee.profileImage });
  } catch (err) {
    await discardUpload(req.file);
    console.error("Error updating profile picture:", err);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};
