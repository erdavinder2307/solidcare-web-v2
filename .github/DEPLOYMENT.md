# GitHub Actions — Web CI/CD

Deploys to Azure Static Web Apps on push to `develop`.

## Secrets (repository secrets)

| Secret | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://solidcare-api-dev.azurewebsites.net/api/v1` |
| `AZURE_STATIC_WEB_APPS_TOKEN` | Retrieve with: `az staticwebapp secrets list -n solidcare-web-dev -g solidev --query properties.apiKey -o tsv` |

The SWA deployment token is **sensitive** — store only in GitHub Secrets, never commit to the repo.

## Build note

CI uses `npx vite build` until `npm run build` TypeScript project errors are resolved.

## Custom domains

Production site: https://solidcare.org  
Ensure API `CORS_ORIGINS` includes `https://solidcare.org` and `https://www.solidcare.org`.
