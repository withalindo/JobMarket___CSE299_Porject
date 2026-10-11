// Quick manual check that PDF text extraction works: node testpdf.js [path-to-pdf]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// Import the library file directly - the package's default entry crashes under ES modules.
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2] || path.join(here, "src", "ResumeUploads", "alindo_Resume.pdf");

pdfParse(fs.readFileSync(file)).then(data => {
  console.log(data.text);
});
