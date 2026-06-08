# Publishing Checklist

Current local status:

- Actor code exists and passes syntax checks.
- Local dry-run works through `npm run local-demo`.
- Git repo initialized.
- Latest useful commit: `bed3469 Add public URL AI audit actor`.

## What This Product Does

The Actor accepts a public URL or public GitHub repo and generates a Markdown/JSON report:

- landing page copy fix;
- AI SEO / GEO mini audit;
- GitHub repo trust audit;
- competitor messaging snapshot.

It rejects local/private URLs and obvious secret-like content.

## External Account Needed

Apify account.

The user should create/log in to Apify and provide only safe public/account context. Do not paste Apify API tokens into chat. If a token is needed, save it in a local `.env` or Apify secret, not in repository files.

## First Apify Steps

1. Create or log in to Apify.
2. Install/use Apify CLI if needed.
3. Push this actor directory to Apify.
4. Run private test with `DRY_RUN=true`.
5. Add model secrets only inside Apify environment:

```text
DRY_RUN=false
UPSTREAM_BASE_URL=https://your-openai-compatible-provider/v1
UPSTREAM_API_KEY=secret
DEFAULT_MODEL=gpt-5.4-mini
MAX_OUTPUT_TOKENS=1200
```

6. Run one model-backed test on a harmless public URL.
7. Review quality and cost.
8. Only then consider Apify Store listing and pay-per-event monetization.

## Local Verification

```powershell
cd 'C:\Users\Administrator\Desktop\新建文件夹\public-url-ai-audit-actor'
npm run check
npm run local-demo
```

Generated local demo files:

```text
dist/local-demo/REPORT.md
dist/local-demo/REPORT.json
```

## GitHub Blocker

GitHub CLI auth was invalid for account `nonggde` during the previous publish attempt. If we want this actor in a public GitHub repo, refresh GitHub auth first:

```powershell
& 'C:\Program Files\GitHub CLI\gh.exe' auth refresh -h github.com
```

Then create/push:

```powershell
cd 'C:\Users\Administrator\Desktop\新建文件夹\public-url-ai-audit-actor'
& 'C:\Program Files\GitHub CLI\gh.exe' repo create public-url-ai-audit-actor --public --source . --remote origin --push
```

## Monetization Guardrails

- Do not sell raw gateway access.
- Do not accept private URLs, secrets, credentials, customer data, or regulated data.
- Keep free/demo runs dry-run unless a tiny test is explicitly approved.
- Start with a manual service upsell before enabling broad paid usage.
