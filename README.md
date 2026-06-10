# Solidcare Web V2

React 19 + TypeScript + Vite + Material UI frontend for the Solidcare healthcare platform.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── app/
│   ├── App.tsx          # Root component with all providers
│   ├── Router.tsx       # React Router v7 route definitions
│   ├── providers/       # Auth, Theme, Query, Notification providers
│   └── store/           # Zustand stores (auth, clinic, ui)
├── features/            # Feature-based modules
│   ├── auth/            # Login, MFA pages
│   ├── patients/        # Patient list, registration, profile
│   ├── doctors/         # Doctor management
│   ├── appointments/    # Appointment booking, queue
│   ├── clinical/        # Consultation workspace, encounters
│   ├── prescriptions/   # Digital prescriptions
│   ├── billing/         # Invoices and payments
│   ├── notifications/   # Notification centre
│   └── reports/         # Dashboard, analytics
├── shared/
│   ├── components/      # Layout (AppShell, Sidebar, Topbar), guards, feedback
│   ├── hooks/           # usePermissions, usePagination
│   └── utils/           # formatters, validators
└── lib/
    ├── api/             # Axios client with JWT/refresh interceptors, TanStack Query setup
    └── theme/           # MUI theme, palette
```

## Key Technologies

| Purpose | Library |
|---|---|
| Framework | React 19 |
| Build | Vite 6 |
| UI | Material UI v6 |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm test             # Run tests
```

## RBAC

Permissions are embedded in the JWT and available via `useAuthStore().can(permission)`.
Protected UI elements are wrapped in `<PermissionGuard permission="patient:read">`.
