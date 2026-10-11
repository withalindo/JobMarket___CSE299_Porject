// Session helpers. The app identifies the logged-in account with
// req.session.user (the Mongo _id) and req.session.userType ("employee" | "company").

export const requireAuth = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Please log in to continue" });
  }
  next();
};

export const requireEmployee = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.session.userType !== "employee") {
      return res.status(403).json({ message: "An employee account is required" });
    }
    next();
  });
};

export const requireCompany = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.session.userType !== "company") {
      return res.status(403).json({ message: "A company account is required" });
    }
    next();
  });
};

// Starts a fresh session for the account (regenerating the id prevents session fixation).
export const startSession = (req, account, userType) =>
  new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.user = account._id.toString();
      req.session.userType = userType;
      req.session.save((saveErr) => (saveErr ? reject(saveErr) : resolve()));
    });
  });
