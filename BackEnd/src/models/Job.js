import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    category: {
        type: String,
        // required: true,
    },
    location: {
        type: String,
        // required: true,
    },
    Salary: {
        type: String,
        // required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;