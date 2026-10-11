import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import { startSession } from "../middleware/auth.js";
import { JWT_SECRET } from "../config/env.js";

export const login = async (req, res) => {
    const { companyName, password } = req.body;

    if (!companyName || !password) {
        return res.status(400).json({ message: "Company name and password are required" });
    }

    try {
        // Only allow company login
        const user = await Company.findOne({ companyName: companyName });
        if (!user) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Accounts created through Google / LinkedIn have no password to compare against.
        if (!user.password) {
            return res.status(401).json({ message: "This account uses Google or LinkedIn sign-in" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        await startSession(req, user, "company");

        const token = jwt.sign({ id: user._id, type: "company" }, JWT_SECRET, {
            expiresIn: "1h"
        });

        res.status(200).json({ message: "Login successful", token, userType: "company" });
        console.log("Company login:", companyName);

    } catch (err) {
        console.error("Login error: ", err);
        res.status(500).json({ message: "Internal server error. Our developer team is working really hard to resolve the problem" });
    }
};
