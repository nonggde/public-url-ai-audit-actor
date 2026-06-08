# Public URL AI Audit Report

An Apify Actor that turns one public URL or public GitHub repository into a concise AI-assisted report.

Built by `city in the sky`.

This is built for small paid reports, not raw API resale. The Actor can generate:

- landing page copy fixes
- AI SEO / GEO mini audits
- GitHub repo trust audits
- competitor messaging snapshots

## Why This Can Earn

Many builders need quick external feedback but do not want to share accounts, private repos, or customer data. This Actor accepts public URLs only, produces a Markdown report, and can later be monetized through Apify pay-per-event or used as a lead generator for deeper paid services.

## Input

```json
{
  "targetUrl": "https://example.com",
  "auditType": "landing_page_copy",
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

- USD 19 for one public URL or public GitHub repository audit.
- Payment accepted through PayPal invoice/link or crypto invoice.
- Buyer sends only the public URL and optional public notes after payment.

Suggested Apify pay-per-event:

- `report_generated`: USD 3-9 after quality and limits are tested.

Manual upsell:

- USD 49 LLM Cost Leak Audit
- USD 99 implementation checklist or route tuning

## Publishing Checklist

1. Create an Apify account.
2. Push the Actor from this directory.
3. Keep `DRY_RUN=true` for the first private test.
4. Add model secrets in Apify environment only after testing.
5. Publish privately, run sample reports, then apply for Store listing.
6. Enable monetization only after report quality, costs, and input limits are proven.

## Boundaries

This Actor is an assistant report generator. It is not a legal, security, financial, medical, or compliance audit. Security-critical systems need professional review.
