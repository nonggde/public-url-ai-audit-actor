import { Actor, log } from "apify";
import {
  createAuditOutput,
  defaultInput
} from "./report-engine.mjs";

function envFlag(name, fallback = "false") {
  return String(process.env[name] || fallback).toLowerCase() === "true";
}

async function maybeCharge(output) {
  if (!envFlag("ENABLE_PPE_CHARGE")) {
    return { charged: false, reason: "ENABLE_PPE_CHARGE is not true" };
  }
  try {
    const result = await Actor.charge({ eventName: "ai-audit-report-generated" });
    return { charged: true, result };
  } catch (error) {
    log.warning("Pay-per-event charge was skipped or failed", { message: error.message });
    return { charged: false, reason: error.message };
  }
}

await Actor.init();

try {
  const input = await Actor.getInput() || defaultInput();
  const output = await createAuditOutput(input, {
    onFetch: (details) => log.info("Fetching content", details)
  });
  const charge = await maybeCharge(output);
  const outputWithCharge = { ...output, charge };

  await Actor.pushData(outputWithCharge);
  await Actor.setValue("REPORT.md", output.report, { contentType: "text/markdown; charset=utf-8" });
  await Actor.setValue("REPORT.json", outputWithCharge, { contentType: "application/json; charset=utf-8" });
  log.info("Report generated", { dryRun: output.dryRun, reportChars: output.report.length, charged: charge.charged });
} finally {
  await Actor.exit();
}
