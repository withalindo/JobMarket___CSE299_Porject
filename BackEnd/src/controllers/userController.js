import Employee from "../models/Employee.js";
import { escapeRegex, EMPLOYEE_PUBLIC_FIELDS, COMPLETED_PROFILE } from "../utils/helpers.js";

// GET /api/employees?search=<name>
// Lists employees who finished their profile. Credentials / OAuth ids are never returned.
export const getAllEmployees = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = { ...COMPLETED_PROFILE };
        if (typeof search === "string" && search.trim() !== "") {
            filter.fullname = { $regex: escapeRegex(search.trim()), $options: "i" };
        }
        const employees = await Employee.find(filter)
            .select(EMPLOYEE_PUBLIC_FIELDS)
            .sort({ createdAt: -1 });
        res.json(employees);

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve employees" });
        console.error("Error retrieving employees:", error);
    }
};
