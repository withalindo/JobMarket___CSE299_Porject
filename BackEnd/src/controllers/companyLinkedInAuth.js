import passport from "../config/passport.js";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { SERVER_URL, linkedinEnabled } from "../config/env.js";
import { findOrCreateCompany } from "../utils/oauthAccounts.js";

if (linkedinEnabled) {
    passport.use("linkedin-company",
        new LinkedInStrategy(
            {
                clientID: process.env.LinkedIn_Client_ID,
                clientSecret: process.env.LinkedIn_Client_Secret,
                callbackURL: `${SERVER_URL}/auth/linkedin/company/callback`,
                scope: ['r_emailaddress', 'r_liteprofile'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    done(null, await findOrCreateCompany("linkedinId", profile));
                } catch (error) {
                    console.error("Error in LinkedIn company strategy:", error);
                    done(error);
                }
            }
        )
    );
}
