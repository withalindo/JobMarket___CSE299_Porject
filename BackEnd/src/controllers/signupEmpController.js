import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import { startSession } from "../middleware/auth.js";

// Employee Signup Controller
export const signupEmployee = async (req, res) => {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const { password } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hashing Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new employee
        const newEmployee = new Employee({
            username,
            email,
            password: hashedPassword,
        });

        await newEmployee.save();

        // Log the new employee in so the next sign-up steps (profile picture, CV) are authenticated.
        await startSession(req, newEmployee, "employee");

        res.status(201).json({ message: "Successfully created a fresh employee account. All the best :)" });

    } catch (error) {
        if (error.code === 11000) {
            const field = error.keyPattern?.username ? "Username" : "Email";
            return res.status(400).json({ message: `${field} already exists. Please use a different one.` });
        }
        console.error("Error creating employee:", error);
        res.status(500).json({ message: "Internal server error. Our developer team is working hard to resolve the problem. Thanks for your Patience" });
    }
};
