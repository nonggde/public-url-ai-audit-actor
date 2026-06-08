import fs from "node:fs";
import path from "node:path";
import { createAuditOutput, defaultInput } from "./report-engine.mjs";

const inputPath = process.argv[2] || "examples/sample-input.json";
const input = fs.existsSync(inputPath)
  ? JSON.parse(fs.readFileSync(inputPath, "utf8"))
  : defaultInput();

process.env.DRY_RUN = process.env.DRY_RUN || "true";

const output = await createAuditOutput(input, {
  onFetch: (details) => console.log(`FETCH ${JSON.stringify(details)}`)
});

const outDir = path.resolve("dist/local-demo");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "REPORT.md"), output.report, "utf8");
fs.writeFileSync(path.join(outDir, "REPORT.json"), JSON.stringify(output, null, 2), "utf8");

console.log(`dryRun=${output.dryRun}`);
console.log(`reportChars=${output.report.length}`);
console.log(`outputDir=${outDir}`);
