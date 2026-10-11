import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    linkedinId: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        // added unique: true
        unique: true,
    },
    fullname: {
        type: String, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Turned off for Google sign-up
    },
    phoneNumber: {
        type: String,
    },
    collegeOrUniversity: {
        type: String,
    },
    address: {
        type: String,
    },
    district: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other",
    },
    birthdate: {
        type: Date,
    },
    profileImage: {
        type: String, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    skills: {
        type: String,
        default: "",
    },
    summary: {
        type: String,
        default: "",
    },
    experiences: {
        type: String,
        default: "",
    },
    resume: {
        type: String,
        default: "",
    }
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;