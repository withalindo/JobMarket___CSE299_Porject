import express from "express";
import passport from "passport";
import { CLIENT_URL, googleEnabled, linkedinEnabled } from "../config/env.js";

const router = express.Router();

// Answers 503 instead of crashing when a provider's credentials are missing from .env
const requireProvider = (enabled, label) => (req, res, next) => {
  if (enabled) return next();
  res.status(503).json({ message: `${label} sign-in is not configured on this server` });
};
const google = requireProvider(googleEnabled, "Google");
const linkedin = requireProvider(linkedinEnabled, "LinkedIn");

// After a successful OAuth sign-in, remember the account in the session (the rest of the API
// reads req.session.user) and send the person to the right page for how far their profile is.
const finishLogin = (userType) => (req, res) => {
  const account = req.user;
  req.session.user = account._id.toString();
  req.session.userType = userType;

  let next;
  if (userType === "employee") {
    if (account.resume) next = "/HomeUser";
    else if (account.fullname) next = "/PostSignupEmp2";
    else next = "/PostSignupEmp";
  } else {
    next = account.address || account.description || account.companyLogo ? "/HomeCom" : "/PostSignupCom";
  }
  req.session.save(() => res.redirect(`${CLIENT_URL}${next}`));
};

// ---- Employee ----
router.get("/google", google, passport.authenticate("google-employee", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  google,
  passport.authenticate("google-employee", { failureRedirect: `${CLIENT_URL}/login` }),
  finishLogin("employee")
);

router.get("/linkedin", linkedin, passport.authenticate("linkedin-employee"));
router.get(
  "/linkedin/callback",
  linkedin,
  passport.authenticate("linkedin-employee", { failureRedirect: `${CLIENT_URL}/login` }),
  finishLogin("employee")
);

// ---- Company ----
router.get("/google/company", google, passport.authenticate("google-company", { scope: ["profile", "email"] }));
router.get(
  "/google/company/callback",
  google,
  passport.authenticate("google-company", { failureRedirect: `${CLIENT_URL}/loginCom` }),
  finishLogin("company")
);

router.get("/linkedin/company", linkedin, passport.authenticate("linkedin-company"));
router.get(
  "/linkedin/company/callback",
  linkedin,
  passport.authenticate("linkedin-company", { failureRedirect: `${CLIENT_URL}/loginCom` }),
  finishLogin("company")
);

// Logout: clears both the passport login and the app's own session data.
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
