# Publishing Checklist

Current local status:

- Actor code exists and passes syntax checks.
- Local dry-run works through `npm run local-demo`.
- Git repo initialized.

## What This Product Does

The Actor accepts a public URL or public GitHub repo and generates a Markdown/JSON report:

- AI search visibility / GEO readiness audit;
- landing page copy fix;
- GitHub repo trust audit;
- competitor messaging snapshot.

It rejects local/private URLs and obvious secret-like content.

## External Account Needed

Apify account.

The user should create/log in to Apify and provide only safe public/account context. Do not paste Apify API tokens into chat. If a token is needed, save it in a local `.env` or Apify secret, not in repository files.

## First Apify Steps

1. Push this actor directory to Apify.
2. Keep `DRY_RUN=true`.
3. Run one private dry-run test.
4. Add model secrets only inside Apify environment:

```text
DRY_RUN=false
UPSTREAM_BASE_URL=https://your-openai-compatible-provider/v1
UPSTREAM_API_KEY=secret
DEFAULT_MODEL=gpt-5.4-mini
MAX_OUTPUT_TOKENS=1200
```

5. Run one model-backed test on a harmless public URL.
6. Review quality and cost.
7. Configure the custom pay-per-event:

```text
ai-audit-report-generated
```

8. Enable `ENABLE_PPE_CHARGE=true` only after the event is configured.
9. Only then consider Apify Store listing and pay-per-event monetization.

## Local Verification

```powershell
cd path\to\public-url-ai-audit-actor
npm run check
npm run local-demo
```

Generated local demo files:

```text
dist/local-demo/REPORT.md
dist/local-demo/REPORT.json
```

## GitHub Publishing

Create or update a public portfolio repository only after the public-facing docs are English-only and contain no secrets:

```powershell
cd path\to\public-url-ai-audit-actor
gh repo create public-url-ai-audit-actor --public --source . --remote origin --push
```

## Monetization Guardrails

- Do not sell raw gateway access.
- Do not accept private URLs, secrets, credentials, customer data, or regulated data.
- Keep free/demo runs dry-run unless a tiny test is explicitly approved.
- Start with a manual service upsell before enabling broad paid usage.
