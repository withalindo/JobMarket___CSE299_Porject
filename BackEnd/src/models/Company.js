import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

  googleId: {
    type: String,
  },
  linkedinId: {
    type: String,
  },
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Turned off for Google and LinkedIn auth
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  companyLogo: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", companySchema);

export default Company;