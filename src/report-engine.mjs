import * as cheerio from "cheerio";

const AUDIT_TYPES = new Set([
  "landing_page_copy",
  "ai_seo_geo",
  "github_repo_trust",
  "competitor_messaging"
]);

const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\bsk-[a-z0-9_\-]{20,}\b/i,
  /\b(api[_-]?key|secret|token|password)\b\s*[:=]\s*["']?[a-z0-9_.\-]{16,}/i,
  /\beyJ[a-z0-9_\-]{20,}\.[a-z0-9_\-]{20,}\.[a-z0-9_\-]{10,}\b/i
];

export function defaultInput() {
  return {
    targetUrl: "https://example.com",
    auditType: "landing_page_copy",
    audience: "indie SaaS buyers",
    competitorUrls: [],
    notes: "",
    maxChars: 12000
  };
}

function env(name, fallback = "") {
  return process.env[name] || fallback;
}

function isDryRun() {
  return String(env("DRY_RUN", "true")).toLowerCase() !== "false";
}

function assertPublicUrl(value, label) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL.`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${label} must use http or https.`);
  }
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost"
    || host === "127.0.0.1"
    || host.endsWith(".local")
    || host.startsWith("10.")
    || host.startsWith("192.168.")
    || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  ) {
    throw new Error(`${label} must be a public URL, not a local or private network address.`);
  }
  return parsed;
}

function containsSensitive(text) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(text));
}

function compactWhitespace(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\u0000/g, "")
    .trim();
}

function truncate(text, maxChars) {
  const value = compactWhitespace(text);
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n\n[Truncated at ${maxChars} characters]`;
}

function titleFor(type) {
  return {
    landing_page_copy: "Landing Page Copy Fix",
    ai_seo_geo: "AI SEO / GEO Mini Audit",
    github_repo_trust: "GitHub Repo Trust Audit",
    competitor_messaging: "Competitor Messaging Snapshot"
  }[type] || "Public URL AI Audit";
}

async function fetchText(url, maxChars) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "public-url-ai-audit-actor/0.1 (+https://apify.com)"
    }
  });
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  const raw = await response.text();
  if (containsSensitive(raw)) {
    throw new Error(`Fetched content from ${url} appears to contain sensitive material. Refusing to process.`);
  }

  if (contentType.includes("text/html") || raw.includes("<html")) {
    const $ = cheerio.load(raw);
    const title = compactWhitespace($("title").first().text());
    const description = compactWhitespace($('meta[name="description"]').attr("content") || "");
    $("script, style, noscript, svg").remove();
    const headings = $("h1,h2,h3").map((_, el) => compactWhitespace($(el).text())).get().filter(Boolean);
    const body = compactWhitespace($("body").text());
    return truncate([
      title ? `Title: ${title}` : "",
      description ? `Meta description: ${description}` : "",
      headings.length ? `Headings: ${headings.slice(0, 30).join(" | ")}` : "",
      body
    ].filter(Boolean).join("\n"), maxChars);
  }

  return truncate(raw, maxChars);
}

function githubReadmeUrl(parsed) {
  if (parsed.hostname.toLowerCase() !== "github.com") return null;
  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const [owner, repo] = parts;
  return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`;
}

function buildPrompt({ input, primaryText, competitorTexts }) {
  const title = titleFor(input.auditType);
  const competitorBlock = competitorTexts.length
    ? `\nCompetitor context:\n${competitorTexts.map((item, index) => `Competitor ${index + 1}: ${item.url}\n${item.text}`).join("\n\n")}`
    : "";

  return [
    `Create a concise ${title} for a public URL.`,
    "",
    "Rules:",
    "- Use only the supplied public text and clearly mark assumptions.",
    "- Do not invent metrics, users, pricing, funding, customers, or technical claims.",
    "- Prioritize practical fixes over generic advice.",
    "- Include limitations.",
    "- Do not request account access, secrets, private data, or credentials.",
    "",
    `Target URL: ${input.targetUrl}`,
    `Audience: ${input.audience || "not specified"}`,
    `Notes: ${input.notes || "none"}`,
    "",
    "Target content:",
    primaryText,
    competitorBlock,
    "",
    "Return Markdown with these sections:",
    "1. Summary",
    "2. What Works",
    "3. Main Gaps",
    "4. Prioritized Fixes",
    "5. Example Copy Or Messaging",
    "6. Risks And Assumptions",
    "7. Next Actions"
  ].join("\n");
}

function dryRunReport({ input, primaryText, competitorTexts }) {
  const isGithub = input.auditType === "github_repo_trust";
  const competitorLine = competitorTexts.length
    ? `Compared with ${competitorTexts.length} public competitor URL(s).`
    : "No competitor URLs were included.";

  return [
    `# ${titleFor(input.auditType)}`,
    "",
    "## Summary",
    "",
    `This dry-run report shows the actor output shape for ${input.targetUrl}. It extracted public text and did not call a paid model.`,
    "",
    "## What Works",
    "",
    "- The target is public and fetchable.",
    `- Extracted content length: ${primaryText.length} characters.`,
    `- ${competitorLine}`,
    "",
    "## Main Gaps",
    "",
    isGithub
      ? "- A repo trust audit should check README clarity, install steps, examples, maintenance signals, issue guidance, and security/contact expectations."
      : "- A page audit should check headline clarity, buyer promise, proof, call to action, and whether an AI answer engine can understand the product.",
    "- Replace this dry-run section with model-backed findings after payment or approved testing.",
    "",
    "## Prioritized Fixes",
    "",
    "1. State the buyer, outcome, and input/output workflow in the first screen.",
    "2. Add concrete proof: example output, screenshots, supported use cases, or limits.",
    "3. Make the next action explicit and low-friction.",
    "",
    "## Example Copy Or Messaging",
    "",
    "> Send one public URL or sanitized file. Get a concise report with practical fixes and clear limitations.",
    "",
    "## Risks And Assumptions",
    "",
    "- Dry run does not perform semantic model analysis.",
    "- Public content may be incomplete or outdated.",
    "- No private pages, accounts, secrets, or customer data were processed.",
    "",
    "## Next Actions",
    "",
    "- Configure `UPSTREAM_BASE_URL`, `UPSTREAM_API_KEY`, and `DEFAULT_MODEL` for model-backed reports.",
    "- Keep `DRY_RUN=true` for free demos and listing screenshots.",
    "- Enable monetization only after input limits and report quality are verified."
  ].join("\n");
}

async function modelReport(prompt) {
  const baseUrl = env("UPSTREAM_BASE_URL", "https://xcode.best/v1").replace(/\/$/, "");
  const apiKey = env("UPSTREAM_API_KEY");
  const model = env("DEFAULT_MODEL", "gpt-5.4-mini");
  if (!apiKey) throw new Error("UPSTREAM_API_KEY is required when DRY_RUN=false.");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You write concise, evidence-based audit reports for public websites and GitHub repositories."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: Number(env("MAX_OUTPUT_TOKENS", "1200"))
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Model request failed: HTTP ${response.status} ${data.error?.message || data.error || ""}`.trim());
  }

  return {
    report: data.choices?.[0]?.message?.content || "",
    model,
    usage: data.usage || null
  };
}

function scoreReport(report) {
  const sections = ["Summary", "Main Gaps", "Prioritized Fixes", "Risks", "Next Actions"];
  const covered = sections.filter((section) => report.toLowerCase().includes(section.toLowerCase())).length;
  return {
    structureScore: covered,
    sectionChecks: Object.fromEntries(sections.map((section) => [section, report.toLowerCase().includes(section.toLowerCase())])),
    reportChars: report.length
  };
}

export async function createAuditOutput(input, hooks = {}) {
  if (!AUDIT_TYPES.has(input.auditType)) {
    throw new Error(`Unsupported auditType: ${input.auditType}`);
  }
  if (containsSensitive(input.notes || "")) {
    throw new Error("Notes appear to contain sensitive material. Remove secrets before running.");
  }

  const maxChars = Math.min(Math.max(Number(input.maxChars || 12000), 2000), 24000);
  const target = assertPublicUrl(input.targetUrl, "targetUrl");
  const readmeUrl = githubReadmeUrl(target);
  const fetchUrl = input.auditType === "github_repo_trust" && readmeUrl ? readmeUrl : target.href;

  hooks.onFetch?.({ fetchUrl, auditType: input.auditType });
  const primaryText = await fetchText(fetchUrl, maxChars);

  const competitorTexts = [];
  for (const url of input.competitorUrls || []) {
    const parsed = assertPublicUrl(url, "competitorUrl");
    hooks.onFetch?.({ url: parsed.href, competitor: true });
    competitorTexts.push({ url: parsed.href, text: await fetchText(parsed.href, Math.min(maxChars, 8000)) });
  }

  const prompt = buildPrompt({ input, primaryText, competitorTexts });
  const modelResult = isDryRun()
    ? { report: dryRunReport({ input, primaryText, competitorTexts }), model: "dry-run", usage: null }
    : await modelReport(prompt);

  return {
    targetUrl: input.targetUrl,
    auditType: input.auditType,
    audience: input.audience || "",
    dryRun: isDryRun(),
    model: modelResult.model,
    usage: modelResult.usage,
    report: modelResult.report,
    reportQuality: scoreReport(modelResult.report),
    fetched: {
      targetFetchUrl: fetchUrl,
      targetChars: primaryText.length,
      competitorCount: competitorTexts.length
    },
    createdAt: new Date().toISOString()
  };
}
