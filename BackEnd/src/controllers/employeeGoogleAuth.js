import passport from "../config/passport.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { SERVER_URL, googleEnabled } from "../config/env.js";
import { findOrCreateEmployee } from "../utils/oauthAccounts.js";

if (googleEnabled) {
    passport.use("google-employee",
        new GoogleStrategy(
            {
                clientID: process.env.Google_Client_ID,
                clientSecret: process.env.Google_Client_Secret,
                callbackURL: `${SERVER_URL}/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    done(null, await findOrCreateEmployee("googleId", profile));
                } catch (error) {
                    console.error("Error in Google employee strategy:", error);
                    done(error);
                }
            }
        )
    );
}
