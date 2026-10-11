import Employee from "../models/Employee.js";
import Job from "../models/Job.js";
import { attachCompanyInfo, EMPLOYEE_PUBLIC_FIELDS, COMPLETED_PROFILE } from "../utils/helpers.js";

// Salary is free text ("50k-70k", "$80,000"). Use the largest number in it, with k = thousand.
const salaryValue = (salary) => {
	const numbers = String(salary || "").match(/\d[\d,]*(?:\.\d+)?\s*[kK]?/g) || [];
	const values = numbers.map((token) => {
		const base = parseFloat(token.replace(/,/g, ""));
		return /[kK]\s*$/.test(token) ? base * 1000 : base;
	});
	return values.length ? Math.max(...values) : 0;
};

// Get top 3 employees (most recent) - public, so no credentials or private ids
export const getTopEmployees = async (req, res) => {
	try {
		const employees = await Employee.find(COMPLETED_PROFILE)
			.select(EMPLOYEE_PUBLIC_FIELDS)
			.sort({ createdAt: -1 })
			.limit(3);
		res.json(employees);
	} catch (err) {
		console.error("Error loading landing page employees:", err);
		res.status(500).json([]);
	}
};

// Get jobs with highest salary (top 3)
export const getTopJobsBySalary = async (req, res) => {
	try {
		const jobs = await Job.find();
		const top = jobs
			.sort((a, b) => salaryValue(b.Salary) - salaryValue(a.Salary) || b.postedAt - a.postedAt)
			.slice(0, 3);
		res.json(await attachCompanyInfo(top));
	} catch (err) {
		console.error("Error loading landing page jobs:", err);
		res.status(500).json([]);
	}
};
