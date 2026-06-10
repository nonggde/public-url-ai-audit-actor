# AI Search Visibility / GEO Audit Report

Built by `city in the sky`.

This Apify Actor turns one public URL or public GitHub repository into a concise AI-assisted report. The main paid use case is an AI search visibility / GEO readiness audit: how clearly a public page explains its entity, offer, audience, proof, and answer-ready content for ChatGPT-style search, Perplexity-style answers, and AI overview surfaces.

It can also generate landing page copy fixes, GitHub repo trust audits, and competitor messaging snapshots.

## Paid Delivery

Need a reviewed report instead of running the Actor yourself?

- AI Search Visibility / GEO Audit: USD 19+ after scope confirmation.
- Product page: https://nonggde.github.io/city-in-the-sky-services/ai-search-visibility.html
- Manual order guide: https://nonggde.github.io/city-in-the-sky-services/order.html
- Related recurring competitor brief: https://ko-fi.com/a13553776411gmailcom/tiers

Public URLs and public repositories only. Do not send logins, private dashboards, credentials, customer data, API keys, payment data, wallet secrets, KYC material, or regulated data.

## Why This Can Earn

Many builders now ask whether AI search engines can understand and cite their product. Most do not need a large SEO subscription; they need a fast outside read with practical fixes. This Actor accepts public URLs only, produces a Markdown report, and can be sold as a manual service or later as an Apify pay-per-event report generator.

## Input

```json
{
  "targetUrl": "https://example.com",
  "auditType": "ai_search_visibility",
  "audience": "indie SaaS buyers",
  "competitorUrls": [],
  "notes": "",
  "maxChars": 12000
}
```

## Output

- Dataset item with report metadata
- `REPORT.md` in the key-value store
- `REPORT.json` in the key-value store

For AI search visibility reports, the model is prompted to cover entity clarity, topical authority, content structure, schema/crawlability hints, answer-ready copy, proof signals, citation risk, prioritized fixes, and limitations.

## Local Demo

Install dependencies:

```powershell
npm install
```

Run a dry-run demo:

```powershell
npm run demo:win
```

The dry-run does not call an upstream model and is safe for screenshots and store listing tests.

See [`examples/model-backed-sample.md`](examples/model-backed-sample.md) for a shortened model-backed sample.

## Model-Backed Run

Set these in Apify secrets or local environment. Do not commit them.

```text
DRY_RUN=false
UPSTREAM_BASE_URL=https://your-openai-compatible-provider/v1
UPSTREAM_API_KEY=your-secret-key
DEFAULT_MODEL=gpt-5.4-mini
MAX_OUTPUT_TOKENS=1200
```

## Safety Rules

- Public URLs only.
- No account login.
- No private pages.
- No form submission.
- No API keys, passwords, tokens, private keys, cookies, wallet seeds, customer data, or regulated data.
- Fetched content is rejected if obvious secret-like patterns appear.
- Report text must not invent metrics, customers, pricing, funding, or technical claims.

## Monetization Plan

Manual starter service:

- USD 19 for one public URL AI search visibility / GEO readiness audit.
- USD 49 for one audit plus a rewritten answer-ready homepage section.
- PayPal payment link or crypto invoice after scope confirmation.
- Buyer sends only the public URL and optional public notes.

Suggested Apify pay-per-event:

- `ai-audit-report-generated`: USD 0.19-0.49 per generated report after quality and cost testing.
- Higher manual packages should remain available for reviewed reports and copy rewrites.

## Publishing Checklist

1. Push the Actor from this directory.
2. Keep `DRY_RUN=true` for the first private test.
3. Add model secrets in Apify environment only after testing.
4. Publish privately, run sample reports, then apply for Store listing.
5. Enable `ENABLE_PPE_CHARGE=true` only after the custom event is configured in Apify pricing.
6. Enable monetization only after report quality, costs, and input limits are proven.

## Boundaries

This Actor is an assistant report generator. It is not a legal, security, financial, medical, or compliance audit. Security-critical systems need professional review.
