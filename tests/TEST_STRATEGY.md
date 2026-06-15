# Playwright E2E Test Strategy — Solidcare V2

## Coverage Goals

| Category | Target | Tag |
|----------|--------|-----|
| Smoke | 100% critical paths | `@smoke` |
| Authentication | 100% login/logout/session | `@auth` |
| Navigation | All primary nav items | `@navigation` |
| Patient CRUD | Create, read, search, edit | `@patients` |
| Appointments | List, queue, create, cancel | `@appointments` |
| Clinical | Encounters, prescriptions, waiting room | `@clinical` |
| Billing | Invoices list and detail | `@billing` |
| RBAC | 5 roles × key routes | `@rbac` |
| Healthcare workflow | Full patient journey | `@workflow` |
| Accessibility | WCAG 2.1 AA scan on key pages | `@a11y` |
| Responsive | 4 viewports | `@responsive` |
| Security | Auth, API, RBAC enforcement | `@security` |

## Test Types

- **Smoke Tests**: Fast validation before deployment
- **Regression Tests**: Full functional suite on PR/merge
- **Role-Based Tests**: Per-role allowed/restricted actions
- **Healthcare Workflow Tests**: End-to-end clinical + billing journey
- **Accessibility Tests**: axe-core WCAG scans + keyboard nav
- **Responsive Tests**: Desktop, laptop, tablet, mobile screenshots
- **Security Tests**: Unauthenticated access, API auth, RBAC gaps

## Execution

```bash
npm run test:e2e              # Full suite
npm run test:e2e:smoke        # Smoke only
npm run test:e2e:report         # Open HTML report
```

## Prerequisites

1. `docker-compose up -d db redis api`
2. Apply migrations and seed: `seed_dev_admin.sql`, `seed_e2e_users.sql`
3. `npm run dev` (or Playwright webServer auto-starts)

## Environment Variables

| Variable | Default |
|----------|---------|
| `PLAYWRIGHT_BASE_URL` | `http://localhost:5173` |
| `PLAYWRIGHT_API_URL` | `http://localhost:8000/api/v1` |
