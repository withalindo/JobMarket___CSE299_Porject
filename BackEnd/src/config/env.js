import crypto from "node:crypto";
import dotenv from "dotenv";

// Importing this module guarantees .env is loaded before anything reads process.env.
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
export const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:2001";

let sessionSecret = process.env.SESSION_SECRET || process.env.Google_Client_Secret;
if (!sessionSecret) {
  sessionSecret = crypto.randomBytes(32).toString("hex");
  console.warn("SESSION_SECRET is not set - using a random one. Sessions will reset on every restart.");
}
export const SESSION_SECRET = sessionSecret;
export const JWT_SECRET = process.env.JWT_SECRET || sessionSecret;

export const googleEnabled = Boolean(process.env.Google_Client_ID && process.env.Google_Client_Secret);
export const linkedinEnabled = Boolean(process.env.LinkedIn_Client_ID && process.env.LinkedIn_Client_Secret);
