import crypto from "node:crypto";
import multer from "multer";
import { UPLOADS_DIR, RESUME_DIR, COMPANY_IMAGE_DIR } from "../config/paths.js";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

// Thrown for rejected files so the error handler can answer with a 400 instead of a 500.
export class UploadError extends Error {}

const IMAGE_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const imageFilter = (req, file, cb) => {
  if (IMAGE_EXTENSIONS[file.mimetype]) return cb(null, true);
  cb(new UploadError("Only JPG, PNG, WEBP or GIF images are allowed"));
};

const imageStorage = (dir) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    // Random name + extension taken from the verified mime type (never from the client's filename).
    filename: (req, file, cb) =>
      cb(null, `${crypto.randomBytes(16).toString("hex")}${IMAGE_EXTENSIONS[file.mimetype]}`),
  });

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, RESUME_DIR),
  // Unique per upload so a rejected file can never clobber the CV that is currently saved;
  // the controller deletes the previous file once the new one has been accepted.
  filename: (req, file, cb) => cb(null, `${req.session.user}_Resume_${Date.now()}.pdf`),
});

const resumeFilter = (req, file, cb) => {
  const isPdf = file.mimetype === "application/pdf" && /\.pdf$/i.test(file.originalname);
  if (isPdf) return cb(null, true);
  cb(new UploadError("Resume must be a PDF file"));
};

const limits = { fileSize: MAX_UPLOAD_BYTES };

export const uploadProfileImage = multer({
  storage: imageStorage(UPLOADS_DIR),
  fileFilter: imageFilter,
  limits,
}).single("profileImage");

export const uploadCompanyLogo = multer({
  storage: imageStorage(COMPANY_IMAGE_DIR),
  fileFilter: imageFilter,
  limits,
}).single("companyLogo");

// Must run after an auth middleware: the file name is derived from the session user.
export const uploadResumeFile = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits,
}).single("resume");

// Translates multer / UploadError failures into friendly 400 responses.
export const handleUploadError = (err, res) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? `File is too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB)`
        : err.message;
    res.status(400).json({ message });
    return true;
  }
  if (err instanceof UploadError) {
    res.status(400).json({ message: err.message });
    return true;
  }
  return false;
};
