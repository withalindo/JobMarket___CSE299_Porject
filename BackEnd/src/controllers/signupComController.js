import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { startSession } from "../middleware/auth.js";
import { CLIENT_URL } from "../config/env.js";

// Company Signup Controller
export const signupCompany = async (req, res) => {
  const companyName = req.body.companyName?.trim();
  const email = req.body.email?.trim();
  const { password } = req.body;

  if (!companyName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hashing Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new company
    const newCompany = new Company({
      companyName,
      email,
      password: hashedPassword,
    });

    await newCompany.save();

    // Log the new company in so the next sign-up step (logo, details) is authenticated.
    await startSession(req, newCompany, "company");

    res.status(201).json({
      message: "Successfully created a company account. Welcome aboard!",
      redirectUrl: `${CLIENT_URL}/PostSignupCom`,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({ message: "Email already exists. Please use a different email." });
    } else {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Internal server error. Please try again later." });
    }
  }
};
