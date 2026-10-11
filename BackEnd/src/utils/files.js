import fs from "node:fs/promises";
import path from "node:path";

// Older records stored a full OS path such as "uploads\\4c0b..." instead of a bare file name.
// Reduce either form to just the file name.
export const storedFileName = (value) => {
  if (!value || typeof value !== "string") return "";
  return path.basename(value.replace(/\\/g, "/"));
};

// Deletes a stored file, ignoring "already gone" and other filesystem errors.
export const removeStoredFile = async (dir, value) => {
  const name = storedFileName(value);
  if (!name) return;
  try {
    await fs.unlink(path.join(dir, name));
  } catch {
    /* nothing to clean up */
  }
};

// Removes a file multer just wrote when the request ends up being rejected.
export const discardUpload = async (file) => {
  if (!file?.path) return;
  try {
    await fs.unlink(file.path);
  } catch {
    /* ignore */
  }
};
