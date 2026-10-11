import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Absolute paths so uploads work no matter which directory the server is started from.
const here = path.dirname(fileURLToPath(import.meta.url));

export const BACKEND_ROOT = path.resolve(here, "../..");
export const UPLOADS_DIR = path.join(BACKEND_ROOT, "uploads"); // employee profile pictures
export const RESUME_DIR = path.join(BACKEND_ROOT, "src", "ResumeUploads"); // employee CVs
export const COMPANY_IMAGE_DIR = path.join(BACKEND_ROOT, "src", "CompanyImage"); // company logos

for (const dir of [UPLOADS_DIR, RESUME_DIR, COMPANY_IMAGE_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}
