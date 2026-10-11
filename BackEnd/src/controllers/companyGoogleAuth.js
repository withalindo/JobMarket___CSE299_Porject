import passport from "../config/passport.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { SERVER_URL, googleEnabled } from "../config/env.js";
import { findOrCreateCompany } from "../utils/oauthAccounts.js";

if (googleEnabled) {
  passport.use(
    "google-company",
    new GoogleStrategy(
      {
        clientID: process.env.Google_Client_ID,
        clientSecret: process.env.Google_Client_Secret,
        callbackURL: `${SERVER_URL}/auth/google/company/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          done(null, await findOrCreateCompany("googleId", profile));
        } catch (err) {
          console.error("Error in Google company strategy:", err);
          done(err);
        }
      }
    )
  );
}
