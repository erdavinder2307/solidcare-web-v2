# Solidcare V2 — Implementation Roadmap
> Version 1.0 | 2026-06-11

---

## Phase Sequence

```
Phase A → Phase B → Phase C → Phase D → Phase E → Phase F → Phase G
Shell      Nav       Design    Patient   Doctor    Admin     Reports
           System    System    Workspace Workspace
```

Each phase is independently shippable and incrementally improves the product.

---

## Phase A — Application Shell
**Goal:** Replace the current single-panel shell with the enterprise 3-region layout.  
**Duration estimate:** 4–5 days  
**Unlocks:** All subsequent phases — nothing else ships without this.

### Tasks

| # | Task | File(s) to Change | Priority |
|---|------|-------------------|----------|
| A1 | Update Topbar: move org/clinic switcher to left, add placeholder for Cmd+K | `Topbar.tsx` | Critical |
| A2 | Update Sidebar: add group labels (shown in expanded, hidden in collapsed), add bottom section divider | `Sidebar.tsx` | Critical |
| A3 | Add badge/count support to sidebar nav items | `Sidebar.tsx`, `navigation.tsx` | High |
| A4 | Replace `Grid v1` API with `Grid v2` (`size={}`) across all components | Multiple files | High |
| A5 | Add `skip-to-content` link in `AppShell` | `AppShell.tsx` | High |
| A6 | Add `NotificationDrawer` component (right-anchored `Drawer`, 400px) | New: `NotificationDrawer.tsx` | High |
| A7 | Wrap notification panel fetch in drawer open state (already done, verify) | `Topbar.tsx` | Medium |
| A8 | Mobile: add `WorkspaceSwitcher` to mobile drawer / bottom sheet | `Topbar.tsx`, new `MobileHeader.tsx` | High |
| A9 | Add density toggle to user menu dropdown | `Topbar.tsx` | Low |

### Dependencies
- None — first phase

---

## Phase B — Navigation
**Goal:** Make navigation enterprise-grade with keyboard shortcuts and command palette.  
**Duration estimate:** 3–4 days  
**Unlocks:** Power-user efficiency; required before doctor demo.

### Tasks

| # | Task | File(s) to Change | Priority |
|---|------|-------------------|----------|
| B1 | Add `CommandPalette` component (`Cmd+K`): patient search + quick actions + nav shortcuts | New: `CommandPalette.tsx`, `useCommandPalette.ts` | Critical |
| B2 | Register global keyboard shortcut `Cmd+K` in `AppShell` | `AppShell.tsx` | Critical |
| B3 | Update `ContextNav` tab strip: add badge support, animated underline indicator | `ContextNav.tsx` | High |
| B4 | Add `Diagnoses` and `Lab Results` tabs to patient workspace nav | `patientNav.ts` | High |
| B5 | Fix breadcrumb consistency — ensure all pages pass breadcrumbs | All page components | Medium |
| B6 | Add keyboard shortcut hints in sidebar tooltips (collapsed state) | `Sidebar.tsx` | Low |
| B7 | Add `aria-current="page"` to active nav items | `Sidebar.tsx`, `ContextNav.tsx` | High |

### Dependencies
- Phase A must be complete (Topbar has correct layout)

---

## Phase C — Design System
**Goal:** Apply the full design system spec. Eliminate all hardcoded colors and inconsistencies.  
**Duration estimate:** 5–6 days  
**Unlocks:** Consistent visual language across all phases.

### Tasks

| # | Task | File(s) to Change | Priority |
|---|------|-------------------|----------|
| C1 | Update `tokens.ts`: update brand colors to indigo, add `healthcareStatus` tokens, add `border` to semantic colors | `tokens.ts` | Critical |
| C2 | Update `theme.ts`: update Grid v2 defaults, update focus ring to shadow-based, update `MuiListItemButton` active state with left border | `theme.ts` | Critical |
| C3 | Redesign `StatusBadge` from MUI Chip to custom colored badge with dot indicator | `StatusBadge.tsx` | Critical |
| C4 | Extract `KpiCard` from `DashboardPage` into `shared/ui/KpiCard.tsx` | New: `KpiCard.tsx`, `DashboardPage.tsx` | High |
| C5 | Add `typography` variant `kpi` for metric numbers and `label` for form labels | `theme.ts` | High |
| C6 | Replace all `alpha()` + hardcoded hex in sx props with token references | Multiple files | High |
| C7 | Standardize icon variant: audit all pages, ensure Outlined variant used consistently | Multiple files | Medium |
| C8 | Add `VitalsIndicator` component for color-coded vitals in consultation | New: `VitalsIndicator.tsx` | High |
| C9 | Update `AllergyBanner` with severity colors and `role="alert"` | `AllergyBanner.tsx` | High |
| C10 | Add focus ring CSS globally in `MuiCssBaseline` | `theme.ts` | High |

### Dependencies
- Can be done alongside Phase A/B

---

## Phase D — Patient Workspace
**Goal:** Redesign patient workspace to match the AthenaOne-inspired blueprint.  
**Duration estimate:** 6–8 days  
**Unlocks:** Core clinical demo capability.

### Tasks

| # | Task | File(s) to Change | Priority |
|---|------|-------------------|----------|
| D1 | Make `PatientHeader` sticky (position sticky, z-index management) | `PatientHeader.tsx`, `PatientWorkspace.tsx` | Critical |
| D2 | Refactor `PatientHeader`: add RBAC to all action buttons (canEdit, canBook, canEncounter) | `PatientHeader.tsx` | Critical |
| D3 | Upgrade `PatientListPage` to use shared `DataTable` component | `PatientListPage.tsx` | High |
| D4 | Add column sorting to patient list | `PatientListPage.tsx`, `DataTable.tsx` | High |
| D5 | Add advanced filter panel to patient list (gender, blood group, active/inactive, date range) | `PatientListPage.tsx`, New: `PatientFilters.tsx` | High |
| D6 | Resolve doctor name in `AppointmentListPage` (create `useDoctorNameMap` hook) | New: `useDoctorNameMap.ts`, `AppointmentListPage.tsx` | Critical |
| D7 | Add date filter (today / this week / date range) to appointment list | `AppointmentListPage.tsx` | High |
| D8 | Format dates/times using locale formatter in appointment list | `AppointmentListPage.tsx` | High |
| D9 | Create `PatientDiagnosesTab` page | New: `PatientDiagnosesTab.tsx`, update router | High |
| D10 | Create `PatientLabsTab` page | New: `PatientLabsTab.tsx`, update router | Medium |
| D11 | Fix `PatientWorkspaceSkeleton` to match actual layout | `PatientWorkspaceSkeleton.tsx` | Medium |
| D12 | Add bulk actions to patient list (export selected, bulk status change) | `PatientListPage.tsx` | Medium |
| D13 | Add column visibility toggle to `DataTable` | `DataTable.tsx` | Medium |
| D14 | Add CSV export to patient list | `PatientListPage.tsx` | Low |

### Dependencies
- Phase C tokens must be in place (design system)

---

## Phase E — Doctor Workspace
**Goal:** Redesign the consultation and doctor-facing workflows to reduce clicks.  
**Duration estimate:** 8–10 days  
**Unlocks:** Doctor demo readiness — the most watched workflow.

### Tasks

| # | Task | File(s) to Change | Priority |
|---|------|-------------------|----------|
| E1 | Redesign `DoctorTodayPage`: action-oriented layout matching blueprint (waiting room inline, stat cards) | `DoctorTodayPage.tsx` | Critical |
| E2 | Add `useDoctorNameMap` to consultation page | `ConsultationPage.tsx` | Critical |
| E3 | Add autosave to `ConsultationPage` (30s interval + on-blur, save to localStorage as draft) | `ConsultationPage.tsx` | Critical |
| E4 | Migrate `ConsultationPage` to use `FormSection` from shared/ui | `ConsultationPage.tsx` | High |
| E5 | Add vitals range validation with `VitalsIndicator` component | `ConsultationPage.tsx`, `VitalsIndicator.tsx` | High |
| E6 | Add inline prescription builder to consultation (no page navigation required) | `ConsultationPage.tsx`, New: `InlinePrescriptionBuilder.tsx` | High |
| E7 | Make split workspace resizable (drag handle between panels) | `SplitWorkspace.tsx` | Medium |
| E8 | Add ICD-10 autocomplete for diagnosis entry | New: `ICD10Autocomplete.tsx` | Medium |
| E9 | Add "Quick Prescribe" templates (frequently used drug combos per doctor) | New: `QuickPrescribeTemplates.tsx` | Low |
| E10 | Add follow-up date picker inline in consultation | `ConsultationPage.tsx` | High |
| E11 | Create role-based doctor dashboard as default for doctor role | New: `DoctorDashboard.tsx`, `DashboardPage.tsx` | Critical |

### Dependencies
- Phase D (patient workspace foundation, DataTable, name maps)
- Phase C (design system tokens, VitalsIndicator)

---

## Phase F — Administration
**Goal:** Admin pages up to enterprise standard.  
**Duration estimate:** 5–6 days

### Tasks

| # | Task | File(s) to Change | Priority |
|---|------|-------------------|----------|
| F1 | Upgrade `UsersListPage` to `DataTable` with filters and invite action | `UsersListPage.tsx` | High |
| F2 | Upgrade `ClinicsListPage` to `DataTable` | `ClinicsListPage.tsx` | High |
| F3 | Create `RolesPermissionsPage` — visualize RBAC matrix | New: `RolesPermissionsPage.tsx`, router | Medium |
| F4 | Upgrade `AuditLogPage` with advanced filters (user, action, date range, entity type) | `AuditLogPage.tsx` | High |
| F5 | Create `SettingsPage` sections: Profile, Notifications, Display (density), Security (2FA status) | `SettingsPage.tsx` | Medium |
| F6 | Create `OrganizationsPage` for super_admin | New: `OrganizationsPage.tsx` | Medium |

### Dependencies
- Phase A shell, Phase C design system

---

## Phase G — Reporting
**Goal:** Build a meaningful reports section with actionable charts.  
**Duration estimate:** 5–7 days

### Tasks

| # | Task | File(s) to Change | Priority |
|---|------|-------------------|----------|
| G1 | Rebuild `DashboardPage` as role-adaptive (dispatch to role-specific dashboard component) | `DashboardPage.tsx` | Critical |
| G2 | Extract `KpiCard` used on dashboard to shared component | `KpiCard.tsx` | High |
| G3 | Add Appointment Reports page with date-range charts | New: `AppointmentReportsPage.tsx` | High |
| G4 | Add Revenue Reports page with monthly trends | New: `RevenueReportsPage.tsx` | High |
| G5 | Add Doctor Productivity table to org admin dashboard | `DashboardPage.tsx` | Medium |
| G6 | Replace all `LinearProgress` capacity bars with proper `CapacityBar` component | New: `CapacityBar.tsx` | Medium |
| G7 | Add empty state to all charts (no data illustration + guidance) | Multiple | High |

### Dependencies
- Phase A, Phase C

---

## Audit Fixes (Parallel — Any Phase)

These should be addressed as each file is touched, not as a dedicated phase:

| ID | Fix | Effort |
|----|-----|--------|
| TD1 | `Grid v1` → `Grid v2` everywhere | 1 day |
| TD4 | Type `location.state` properly in `LoginPage` | 15 min |
| A2 | Add `aria-label` to all icon-only buttons | 2 hours |
| A3 | Add `role="alert"` to `AllergyBanner` | 15 min |
| A4 | Add skip-to-content link | 30 min |
| DC4 | Standardize icons to Outlined | 1 day |
| TD7 | Move `organizationsApi.current()` to bootstrap layer | 2 hours |

---

## Effort Summary

| Phase | Effort | Cumulative | Value Delivered |
|-------|--------|------------|-----------------|
| A | 4–5d | 4–5d | Professional shell |
| B | 3–4d | 7–9d | Enterprise navigation |
| C | 5–6d | 12–15d | Consistent design system |
| D | 6–8d | 18–23d | Complete patient workflows |
| E | 8–10d | 26–33d | Doctor-ready consultation |
| F | 5–6d | 31–39d | Admin completeness |
| G | 5–7d | 36–46d | Analytics + reporting |

**Total: 36–46 developer-days** (approx. 7–9 weeks for a single focused developer)
