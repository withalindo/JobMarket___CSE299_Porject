// Where the Node/Express backend lives. Override with VITE_API_URL in a .env file at the project root.
export const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Older records stored an OS path ("uploads\\4c0b...") instead of just the file name.
// Reduce either form to the bare file name before building a URL.
const fileName = (value) => (typeof value === "string" ? value.split(/[\\/]/).pop() : "");

const assetUrl = (folder, value) => {
  const name = fileName(value);
  return name ? `${API_BASE}/${folder}/${encodeURIComponent(name)}` : "";
};

export const profileImageUrl = (value) => assetUrl("uploads", value);
export const companyLogoUrl = (value) => assetUrl("companyImage", value);
export const resumeUrl = (value) => assetUrl("resumes", value);

// Client-side checks that mirror the server's rules (the server still re-validates).
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Returns an error message for an unacceptable image, or "" when it is fine.
export const validateImage = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return "Please choose a JPG, PNG, WEBP or GIF image.";
  if (file.size > MAX_UPLOAD_BYTES) return "That image is larger than 5 MB.";
  return "";
};

// Returns an error message for an unacceptable CV, or "" when it is fine.
export const validatePdf = (file) => {
  if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) return "Your resume must be a PDF file.";
  if (file.size > MAX_UPLOAD_BYTES) return "That PDF is larger than 5 MB.";
  return "";
};

// Best human-readable message from a failed axios request.
export const errorMessage = (err, fallback) => err?.response?.data?.message || fallback;
