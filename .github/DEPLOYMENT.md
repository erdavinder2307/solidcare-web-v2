# GitHub Actions — Web CI/CD

Single workflow: `.github/workflows/ci.yml`

Runs lint, type-check, unit tests, Playwright E2E (non-blocking), production build, and deploy.

## Deploy trigger

Deploys to Azure Static Web Apps (dev) on **push to `main` or `develop`**.  
Pull requests run checks only — no deploy.

## Secrets (repository secrets)

| Secret | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://solidcare-api-dev.azurewebsites.net/api/v1` |
| `AZURE_STATIC_WEB_APPS_TOKEN` | Retrieve with: `az staticwebapp secrets list -n solidcare-web-dev -g solidev --query properties.apiKey -o tsv` |

The SWA deployment token is **sensitive** — store only in GitHub Secrets, never commit to the repo.

## Custom domains

Production site: https://solidcare.org  
Ensure API `CORS_ORIGINS` includes `https://solidcare.org` and `https://www.solidcare.org`.
