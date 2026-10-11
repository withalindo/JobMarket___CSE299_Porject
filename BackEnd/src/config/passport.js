import passport from "passport";
import Employee from "../models/Employee.js";
import Company from "../models/Company.js";

// One serializer/deserializer pair for both account types. Previously each auth file registered
// its own pair, and the employee one swallowed company sessions (Employee.findById -> null).
passport.serializeUser((account, done) => {
  const type = account instanceof Company ? "company" : "employee";
  done(null, { id: account.id, type });
});

passport.deserializeUser(async ({ id, type } = {}, done) => {
  try {
    const Model = type === "company" ? Company : Employee;
    done(null, (await Model.findById(id)) || false);
  } catch (err) {
    done(err);
  }
});

export default passport;
