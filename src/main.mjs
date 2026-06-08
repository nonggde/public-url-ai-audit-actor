import { Actor, log } from "apify";
import {
  createAuditOutput,
  defaultInput
} from "./report-engine.mjs";

await Actor.init();

try {
  const input = await Actor.getInput() || defaultInput();
  const output = await createAuditOutput(input, {
    onFetch: (details) => log.info("Fetching content", details)
  });

  await Actor.pushData(output);
  await Actor.setValue("REPORT.md", output.report, { contentType: "text/markdown; charset=utf-8" });
  await Actor.setValue("REPORT.json", output, { contentType: "application/json; charset=utf-8" });
  log.info("Report generated", { dryRun: output.dryRun, reportChars: output.report.length });
} finally {
  await Actor.exit();
}
