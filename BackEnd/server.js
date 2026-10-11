// env.js loads .env - keep it as the first import so every other module sees the variables.
import { PORT, CLIENT_URL, SESSION_SECRET } from "./src/config/env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "./src/config/passport.js";
import session from "express-session";
import { RESUME_DIR, UPLOADS_DIR, COMPANY_IMAGE_DIR } from "./src/config/paths.js";
import { requireAuth } from "./src/middleware/auth.js";
import { handleUploadError } from "./src/middleware/upload.js";

// Import routes
import signupRoutes from "./src/routes/signupRoutes.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import loginComRoutes from "./src/routes/loginComRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import postSignupEmpRoutes from "./src/routes/postSignupEmpRoutes.js";
import postSignupEmp2Routes from "./src/routes/postSignupEmp2Routes.js";
import postSignupComRoutes from "./src/routes/postSignupComRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import homeUserRoutes from "./src/routes/HomeUserRoutes.js";
import JobPostRoutes from "./src/routes/JobPostRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import landPage3Routes from "./src/routes/LandPage3Routes.js";

// Register the Google / LinkedIn passport strategies (each is skipped if its credentials are missing)
import "./src/controllers/employeeGoogleAuth.js";
import "./src/controllers/companyGoogleAuth.js";
import "./src/controllers/employeeLinkedInAuth.js";
import "./src/controllers/companyLinkedInAuth.js";

if (!process.env.DB_URI) {
  console.error("DB_URI is not set. Copy BackEnd/.env.example to BackEnd/.env and fill it in.");
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Profile pictures and company logos are shown on public pages, so these are open.
app.use("/uploads", express.static(UPLOADS_DIR));
app.use('/companyImage', express.static(COMPANY_IMAGE_DIR));

// Session configuration
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // don't create a session for every anonymous visitor
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true", // set to true when served over HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// CVs contain personal data - only logged-in users may open them (so this needs the session above).
app.use("/resumes", requireAuth, express.static(RESUME_DIR));

// MongoDB connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Job Market API!");
});

// API Routes
app.use("/api/signup", signupRoutes);
app.use("/api", loginRoutes);
app.use("/api", loginComRoutes);
app.use("/auth", authRoutes);
app.use("/api/post-signup-emp", postSignupEmpRoutes);
app.use("/api", postSignupEmp2Routes);
app.use("/api", postSignupComRoutes);
app.use("/api", jobRoutes);
app.use("/api", homeUserRoutes);
app.use("/api", JobPostRoutes);
app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api/landing", landPage3Routes);

// Added for Cookie testing purposes
app.get("/api/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user, userType: req.session.userType });
  } else {
    res.json({ loggedIn: false });
  }
});

// 404 handler (must come after the routes, before the error handler)
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (handleUploadError(err, res)) return; // bad file type / too large -> 400
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Uploads: ${UPLOADS_DIR}`);
  console.log("Routes registered successfully");
});
