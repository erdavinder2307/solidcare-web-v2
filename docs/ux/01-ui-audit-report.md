# Solidcare V2 — UI Audit Report
> Prepared: 2026-06-11 | Auditor: GitHub Copilot (Principal Product Designer role)

---

## Executive Summary

The codebase has a **solid technical foundation**: React 19, TypeScript, MUI v6, Tanstack Query, Zustand, and a custom token layer. The design system scaffolding is good — tokens exist, a custom theme is applied, and there is a `Surface`/`StatusBadge`/`DataTable` component layer. However, the application currently presents at the level of an **internal admin tool** rather than an enterprise healthcare SaaS. The gaps are primarily in information density, visual hierarchy, workflow orientation, and layout expressiveness.

**Verdict:** ~45% of the way to enterprise-grade. The foundation is reusable; the superstructure needs significant redesign.

---

## 1. Layout

### Findings

| ID | Severity | Finding |
|----|----------|---------|
| L1 | High | `AppShell` uses a single `Sidebar + Topbar` layout. There is no **right utility panel**, no **context panel**, no command palette. Enterprise tools (Linear, Stripe) use 3-panel layouts. |
| L2 | High | `PageLayout` passes `maxWidth="none"` universally on most list and workspace pages — content stretches to the full viewport on ultra-wide screens with no maximum readable line length. |
| L3 | Medium | `AppShell` applies `p: { xs: 2, sm: pagePadding*0.75, md: pagePadding }` — the padding is applied at the shell level AND inside PageLayout creating inconsistent spacing on nested pages. |
| L4 | Medium | `Topbar` is `position: fixed` and compensated with `mt: topbarHeight`. This causes scroll jank on iOS Safari and requires careful z-index management. |
| L5 | Low | No sticky content header pattern exists. On long patient workspace pages, the patient identity (name, UHID) scrolls out of view. |
| L6 | Low | No right panel / flyout pattern for quick actions (quick book, quick notes). Every action forces a full page navigation. |

---

## 2. Navigation

### Findings

| ID | Severity | Finding |
|----|----------|---------|
| N1 | High | `NAV_GROUPS` groups items but the sidebar shows no group labels in collapsed mode. Collapsed state loses all wayfinding context. |
| N2 | High | No **command palette** (Cmd+K) for power users. Enterprise tools consider this table stakes. |
| N3 | High | `WorkspaceSwitcher` is hidden on mobile (`display: { xs: "none", md: "inline-flex" }`). Clinic switching on mobile is impossible. |
| N4 | Medium | `ContextNav` is a tab strip with `borderBottom` — it is styled correctly but lacks active indicator animation, overflow fade on mobile, and badge support (e.g. "3 pending invoices" on Billing tab). |
| N5 | Medium | No keyboard shortcut layer. No `aria-keyshortcuts` or registered hotkeys. |
| N6 | Medium | `BOTTOM_NAV_ITEMS` exist in navigation config but the sidebar renders them inline at bottom — they are easy to confuse with main items on mobile. |
| N7 | Low | Breadcrumbs appear inconsistently — some pages pass them, others do not (e.g. `QueueDashboardPage`). |

---

## 3. Pages

### 3.1 Dashboard (`DashboardPage.tsx`)

| ID | Severity | Finding |
|----|----------|---------|
| P-D1 | Critical | Dashboard is **widget-oriented**, not **action-oriented**. 6 KPI cards followed by a charts section. No "what do I do next?" orientation. No tasks, no alerts, no queued actions. |
| P-D2 | High | KPI cards are reusable `Paper` components defined **inside** `DashboardPage.tsx` — they are not extracted to the shared component library. |
| P-D3 | High | No role-based dashboard differentiation. A doctor and a billing clerk see identical content. |
| P-D4 | Medium | `LinearProgress` used as a capacity indicator looks like a loading bar — confusing. |
| P-D5 | Low | `Chip` with trend value uses `color="success"` hardcoded — no negative trend handling. |

### 3.2 Patient List (`PatientListPage.tsx`)

| ID | Severity | Finding |
|----|----------|---------|
| P-PL1 | High | Raw MUI `Table` used instead of the shared `DataTable` component. DataTable was built precisely for this. Creates two code paths to maintain. |
| P-PL2 | High | Search is a single `TextField` with no filter chips, no column filters, no saved filters. For a clinic with 10k+ patients this is unusable. |
| P-PL3 | Medium | No bulk actions (bulk discharge, bulk SMS, bulk export). |
| P-PL4 | Medium | `Avatar` always shows first letter of name — no initials-based color hash, no fallback image support. |
| P-PL5 | Medium | Column "Actions" uses a `VisibilityOutlinedIcon` button — icon-only with no accessible label on hover. The `Tooltip` wraps the button but the icon button lacks `aria-label`. |
| P-PL6 | Low | Table has 9 columns on desktop. On a 1280px screen this causes horizontal scroll — the table is not column-configurable. |

### 3.3 Patient Workspace (`PatientWorkspace.tsx`)

| ID | Severity | Finding |
|----|----------|---------|
| P-PW1 | High | Patient identity (name, UHID, DOB) inside `PatientHeader` is inside `Surface` card. When scrolled, the patient identity disappears — clinician loses context mid-consultation. Needs sticky patient identity bar. |
| P-PW2 | High | `PatientHeader` action buttons (Edit, Book, Invoice, Encounter) are visible to all — RBAC gates are applied inconsistently (`canBill` prop but no `canEdit`, `canBook` gates). |
| P-PW3 | Medium | `AllergyBanner` renders correctly but only shows allergy names as text. No severity classification, no drug-allergy interaction warning hooks. |
| P-PW4 | Medium | `ContextNav` tab strip — "Diagnoses" and "Lab Results" tabs are missing from `patientNav.ts`. These are critical clinical tabs. |
| P-PW5 | Low | `PatientWorkspaceSkeleton` exists but is a basic gray block — doesn't match actual layout (mismatched skeleton shape). |

### 3.4 Appointment List (`AppointmentListPage.tsx`)

| ID | Severity | Finding |
|----|----------|---------|
| P-AL1 | High | Doctor ID shown as truncated UUID: `appt.doctor_id.slice(0, 8)…` — this is a raw ID leak in the UI. Must resolve to doctor name. |
| P-AL2 | High | No date filter on appointment list. All appointments for all time are paginated. No "today", "this week" quick filters. |
| P-AL3 | Medium | `appointment_date` and `start_time` rendered as raw API strings — no locale formatting. |
| P-AL4 | Low | No row-click navigation to appointment detail. |

### 3.5 Consultation Page (`ConsultationPage.tsx`)

| ID | Severity | Finding |
|----|----------|---------|
| P-CP1 | Critical | Vitals fields (BP, pulse, temperature) use raw `TextField` with string values — no unit labels, no range validation, no color-coded out-of-range indicators. |
| P-CP2 | High | `SplitWorkspace` and `PatientChartPanel` are used but the split layout is hardcoded — no resize, no collapse. Doctor cannot maximize the notes pane. |
| P-CP3 | High | No autosave. Loss of consultation notes on navigation is a patient safety risk. |
| P-CP4 | Medium | `useForm` uses uncontrolled inputs with no field-level validation (only schema-level). Prescription creation is a separate page — doctor must leave consultation to prescribe. |
| P-CP5 | Low | `FormSection` component exists in `shared/ui` but is not used in `ConsultationPage` — inline ad-hoc section headers used instead. |

---

## 4. Forms

| ID | Severity | Finding |
|----|----------|---------|
| F1 | High | No shared form component library. `TextField`, `Select`, form layouts all duplicated across `PatientRegisterPage`, `AppointmentBookPage`, `ConsultationPage`. |
| F2 | High | No multi-step form pattern. `PatientRegisterPage` appears to be a single long form — healthcare registration should be split into Personal → Contact → Medical → Insurance steps. |
| F3 | Medium | `zodResolver` used on login but not consistently across all forms. |
| F4 | Medium | No form auto-completion / suggestion fields for diagnosis (ICD-10), medications (drug database), or doctor names. |
| F5 | Low | No `<fieldset>` / `<legend>` semantic grouping in any form — accessibility gap. |

---

## 5. Tables

| ID | Severity | Finding |
|----|----------|---------|
| T1 | High | `DataTable` component exists but most list pages use raw MUI `Table` instead. |
| T2 | High | No column sorting on any table. |
| T3 | High | No column visibility toggle. |
| T4 | Medium | No export (CSV/PDF) on any list page. |
| T5 | Medium | Skeleton loader in `DataTable` uses `width: col.width ?? "80%"` — skeleton width doesn't vary per column causing unnatural uniformity. |
| T6 | Low | `TablePagination` component used but `rowsPerPageOptions` not consistent across pages (some hardcode 20, some default). |

---

## 6. Design Consistency

| ID | Severity | Finding |
|----|----------|---------|
| DC1 | High | `DashboardPage` uses raw `Paper` for KPI cards — ignores the `Surface` component. Two visual patterns for the same concept. |
| DC2 | High | `Grid` v1 API used (`<Grid item xs={...}>`) across components — MUI v6 uses Grid v2 (`<Grid size={...}>`). Deprecation warnings in console. |
| DC3 | Medium | `alpha()` from MUI used in DashboardPage for icon backgrounds — same pattern should use tokens (`colors.brand[50]`) instead. |
| DC4 | Medium | Icon choices are inconsistent — some pages use `Outlined` variants, others use filled. No icon usage standard. |
| DC5 | Medium | Typography scale used inconsistently: `variant="h4"` used for KPI numbers, `variant="h5"` for patient name, `variant="h4"` for stat cards — no semantic sizing hierarchy. |
| DC6 | Low | `textTransform: "uppercase"` and `letterSpacing: 0.5` applied inline in multiple places — should be a typography variant. |

---

## 7. Technical Debt

| ID | Severity | Finding |
|----|----------|---------|
| TD1 | High | `Grid` v1 API deprecation (`<Grid item>`) — affects `PatientHeader`, `DashboardPage`, `DoctorTodayPage`, and others. |
| TD2 | High | Doctor ID displayed as UUID in `AppointmentListPage` — missing doctor name resolution (like `usePatientNameMap` exists for patients). |
| TD3 | High | Inline `sx` objects with raw pixel/hex values instead of tokens — accumulating style debt. `bgcolor: "action.hover"` in PatientHeader UHID badge (not a token). |
| TD4 | Medium | `any` type cast in `LoginPage`: `(location.state as any)?.from?.pathname` — should be typed. |
| TD5 | Medium | `shared/components/forms/` directory is **empty** — components haven't been created yet. |
| TD6 | Medium | No `ErrorBoundary` wrapped at route level — exists but only used at app level. |
| TD7 | Low | `WorkspaceSwitcher` makes `organizationsApi.current()` query independently — should be bootstrapped once in app init. |

---

## 8. Accessibility

| ID | Severity | Finding |
|----|----------|---------|
| A1 | High | Color contrast: `text.secondary` (`#64748B`) on `background.default` (`#F8FAFC`) = 4.3:1 — passes AA for normal text but fails for large UI text at small sizes. |
| A2 | High | Icon-only buttons in `PatientListPage` (`VisibilityOutlinedIcon`) missing `aria-label`. |
| A3 | High | `ContextNav` uses `Box component={Link}` — not a semantic `<a>` or `<button>`. Focus ring styles not confirmed. |
| A4 | Medium | No skip-to-main-content link in `AppShell`. |
| A5 | Medium | `AllergyBanner` doesn't use `role="alert"` — screen readers won't announce it automatically. |
| A6 | Medium | No focus trap in mobile nav drawer. |
| A7 | Low | `<Grid item>` MUI component doesn't render semantic landmarks — sections lack `<main>`, `<nav>`, `<aside>` roles. |

---

## 9. Mobile Responsiveness

| ID | Severity | Finding |
|----|----------|---------|
| M1 | High | `WorkspaceSwitcher` hidden on mobile — clinic context not accessible. |
| M2 | High | Patient workspace `PatientHeader` action buttons wrap to multiple lines on mobile without priority ordering — "Edit" and "Invoice" are equally prominent on small screens. |
| M3 | Medium | `Topbar` notification dropdown (`notifAnchor` menu) is a desktop `Menu` component — no mobile bottom sheet variant. |
| M4 | Medium | Tables overflow horizontally on mobile with no horizontal scroll affordance indicator. |
| M5 | Low | `ConsultationPage` `SplitWorkspace` likely renders poorly on tablet — split layout not tested at `md` breakpoint. |

---

## 10. Summary Scorecard

| Category | Score | Notes |
|----------|-------|-------|
| Architecture | 7/10 | Good feature module structure, router, guards |
| Design System | 5/10 | Tokens exist but inconsistently applied |
| Layout | 4/10 | Single-panel, no enterprise patterns |
| Navigation | 5/10 | Functional but missing power-user features |
| Data Tables | 3/10 | DataTable exists but unused in most places |
| Forms | 3/10 | No shared form layer |
| Accessibility | 4/10 | Several critical gaps |
| Mobile | 5/10 | Functional but secondary |
| **Overall** | **4.5/10** | Solid foundation, needs significant UI uplift |
