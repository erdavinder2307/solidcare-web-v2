# Solidcare V2 — Component Catalog & Refactoring Plan
> Version 1.0 | 2026-06-11

---

## 1. Existing Component Audit

### 1.1 `shared/ui/` — Status

| Component | Status | Action | Notes |
|-----------|--------|--------|-------|
| `Surface.tsx` | ✅ Keep | Minor: add `noPadding` variant | Good pattern, widely used |
| `StatusBadge.tsx` | 🔄 Refactor | Replace Chip with custom colored badge with dot | Visual redesign required |
| `DataTable.tsx` | 🔄 Refactor | Add sorting, column visibility, bulk selection | Foundation is good |
| `DataTablePagination.tsx` | ✅ Keep | Standardize rowsPerPageOptions | Minor fix |
| `EmptyState.tsx` | 🔄 Refactor | Add illustration support, action slot | Currently basic |
| `FormSection.tsx` | ✅ Keep | Ensure used consistently (not currently) | Good, underused |
| `AllergyBanner.tsx` | 🔄 Refactor | Add severity colors, `role="alert"`, severity icons | Safety-critical |
| `Timeline.tsx` | ✅ Keep | No changes needed | Good |

### 1.2 `shared/components/layout/` — Status

| Component | Status | Action | Notes |
|-----------|--------|--------|-------|
| `AppShell.tsx` | 🔄 Refactor | Add skip-to-content, fix padding double-application | Phase A |
| `Sidebar.tsx` | 🔄 Refactor | Add group labels, badge support, bottom section divider | Phase A |
| `Topbar.tsx` | 🔄 Refactor | Move switcher left, add Cmd+K slot, fix mobile switcher | Phase A |
| `WorkspaceSwitcher.tsx` | 🔄 Refactor | Make mobile-visible | Phase A |

### 1.3 `shared/layout/` — Status

| Component | Status | Action | Notes |
|-----------|--------|--------|-------|
| `PageHeader.tsx` | ✅ Keep | Add `sticky` prop option | Solid |
| `PageLayout.tsx` | ✅ Keep | Minor: ensure no padding duplication | Solid |
| `ContextNav.tsx` | 🔄 Refactor | Add badge prop, animated indicator, overflow fade | Phase B |
| `navigation.tsx` | 🔄 Refactor | Add doctor-only items, badge count hooks | Phase A/B |
| `constants.ts` | 🔄 Refactor | Move density values into tokens.ts (consolidate) | Phase C |

---

## 2. New Components Required

### 2.1 Shell & Navigation

| Component | Location | Phase | Description |
|-----------|----------|-------|-------------|
| `CommandPalette.tsx` | `shared/components/navigation/` | B | Cmd+K overlay with patient search + quick actions |
| `NotificationDrawer.tsx` | `shared/components/layout/` | A | Right-anchored 400px notification panel |
| `MobileClinicSwitcher.tsx` | `shared/components/layout/` | A | Mobile-first clinic switcher (bottom sheet) |

### 2.2 Design System Primitives

| Component | Location | Phase | Description |
|-----------|----------|-------|-------------|
| `KpiCard.tsx` | `shared/ui/` | C | Metric display card with icon, value, trend, color |
| `CapacityBar.tsx` | `shared/ui/` | G | Horizontal progress bar for queue/occupancy |
| `VitalsIndicator.tsx` | `shared/ui/` | C/E | Numeric input with range-based color feedback |
| `SectionLabel.tsx` | `shared/ui/` | C | Typography component: uppercase label variant |
| `AvatarWithInitials.tsx` | `shared/ui/` | D | Avatar with deterministic color from name hash |
| `FilterChips.tsx` | `shared/ui/` | D | Row of dismissible filter chips |

### 2.3 Tables

| Component | Location | Phase | Description |
|-----------|----------|-------|-------------|
| `ColumnVisibilityMenu.tsx` | `shared/ui/` | D | Dropdown for toggling column visibility |
| `BulkActionBar.tsx` | `shared/ui/` | D | Floating bar with bulk actions when rows selected |
| `TableToolbar.tsx` | `shared/ui/` | D | Search + filter + column + export controls above table |

### 2.4 Forms

| Component | Location | Phase | Description |
|-----------|----------|-------|-------------|
| `StepperForm.tsx` | `shared/components/forms/` | D | Multi-step form shell with progress indicator |
| `FormField.tsx` | `shared/components/forms/` | C | Label + Input + HelperText wrapper |
| `DatePickerField.tsx` | `shared/components/forms/` | D | MUI DatePicker wrapped with FormField |
| `SearchableSelect.tsx` | `shared/components/forms/` | D | Autocomplete with async search (patients, drugs) |
| `ICD10Autocomplete.tsx` | `shared/components/forms/` | E | ICD-10 code search + select |

### 2.5 Clinical

| Component | Location | Phase | Description |
|-----------|----------|-------|-------------|
| `InlinePrescriptionBuilder.tsx` | `features/clinical/components/` | E | Drug + dose + duration inline entry |
| `QuickPrescribeTemplates.tsx` | `features/clinical/components/` | E | Saved prescription templates picker |
| `PatientChartSummary.tsx` | `features/clinical/components/` | E | Compact left-panel patient info for consultation |
| `PatientDiagnosesTab.tsx` | `features/patients/pages/workspace/` | D | Diagnoses list page |
| `PatientLabsTab.tsx` | `features/patients/pages/workspace/` | D | Lab results tab |

### 2.6 Dashboard

| Component | Location | Phase | Description |
|-----------|----------|-------|-------------|
| `DoctorDashboard.tsx` | `features/reports/components/` | G | Doctor-specific dashboard |
| `ReceptionistDashboard.tsx` | `features/reports/components/` | G | Receptionist action-focused dashboard |
| `AdminDashboard.tsx` | `features/reports/components/` | G | Org/clinic admin metrics dashboard |
| `BillingDashboard.tsx` | `features/reports/components/` | G | Billing staff outstanding-first dashboard |

---

## 3. Specific Refactoring Instructions

### 3.1 `PatientListPage.tsx` → Use `DataTable`

**Before:** Raw MUI `Table` inline in component.  
**After:** Use `DataTable<Patient>` with `columns` config.

```tsx
// Define columns outside component (no re-renders)
const patientColumns: DataTableColumn<Patient>[] = [
  {
    id: "name",
    header: "Patient",
    render: (row) => (
      <Box display="flex" alignItems="center" gap={1.5}>
        <AvatarWithInitials name={row.full_name} size={32} />
        <Box>
          <Typography variant="body2" fontWeight={500}>{row.full_name}</Typography>
          <Typography variant="caption" color="text.secondary" fontFamily="mono">{row.uhid}</Typography>
        </Box>
      </Box>
    ),
  },
  { id: "phone", header: "Phone", render: (row) => formatPhone(row.phone) },
  { id: "gender", header: "Gender/Age", render: (row) => `${row.gender ?? "—"} · ${formatAge(row.date_of_birth)}` },
  { id: "blood", header: "Blood", render: (row) => row.blood_group ?? "—" },
  { id: "status", header: "Status", render: (row) => <EntityStatusBadge status={row.is_active ? "active" : "inactive"} /> },
  { id: "actions", header: "", align: "right", render: (row) => <PatientRowActions patient={row} /> },
];
```

### 3.2 `AppointmentListPage.tsx` → Doctor name resolution

**Problem:** `appt.doctor_id.slice(0, 8)…` leaks UUID.  
**Fix:** Create `useDoctorNameMap` mirroring `usePatientNameMap`, use in appointment list.

```tsx
// New file: src/shared/hooks/useDoctorNameMap.ts
export function useDoctorNameMap() {
  const { data } = useQuery({
    queryKey: ["doctors-name-map"],
    queryFn: () => doctorsApi.list({ page: 1, page_size: 500 }),
    staleTime: 5 * 60_000,
  });
  const doctorNames = new Map(
    (data?.items ?? []).map((d) => [d.id, d.full_name])
  );
  return { doctorNames };
}
```

### 3.3 `DashboardPage.tsx` → Role-adaptive dispatch

**Before:** Single dashboard for all roles.  
**After:** Role-based dispatch component.

```tsx
export default function DashboardPage() {
  const { user } = useAuthStore();
  const primaryRole = getPrimaryRole(user);  // utility function

  if (primaryRole === "doctor") return <DoctorDashboard />;
  if (primaryRole === "receptionist") return <ReceptionistDashboard />;
  if (primaryRole === "billing_staff") return <BillingDashboard />;
  if (primaryRole === "clinic_admin" || primaryRole === "org_admin") return <AdminDashboard />;
  return <AdminDashboard />;  // super_admin fallback
}
```

### 3.4 `Grid v1` → `Grid v2` Migration

**Pattern to replace:**
```tsx
// BEFORE (v1)
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>

// AFTER (v2)
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>
```

**Files to update:**
- `PatientHeader.tsx`
- `DashboardPage.tsx`
- `DoctorTodayPage.tsx`
- `ConsultationPage.tsx`
- `LoginPage.tsx`
- Any other file using `<Grid item>`

### 3.5 `ConsultationPage.tsx` → Autosave

```tsx
// Add after useForm setup:
const draftKey = `consultation-draft-${appointmentId}`;

// Load draft on mount
useEffect(() => {
  const draft = localStorage.getItem(draftKey);
  if (draft) {
    try { reset(JSON.parse(draft)); } catch { /* ignore corrupt draft */ }
  }
}, [appointmentId]);

// Autosave every 30s
useEffect(() => {
  const subscription = watch((values) => {
    localStorage.setItem(draftKey, JSON.stringify(values));
  });
  return () => subscription.unsubscribe();
}, [watch, draftKey]);

// Clear on successful submit
mutation.onSuccess = () => {
  localStorage.removeItem(draftKey);
  // ... navigate
};
```

---

## 4. State Management Review

| Store | Status | Recommendation |
|-------|--------|----------------|
| `authStore.ts` | ✅ Good | No changes needed |
| `clinicStore.ts` | ✅ Good | Add `activeOrganization` field |
| `uiStore.ts` | 🔄 Extend | Add `commandPaletteOpen: boolean`, `notificationDrawerOpen: boolean`, `density` field |

### Add to `uiStore.ts`:
```ts
commandPaletteOpen: false,
notificationDrawerOpen: false,
toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
toggleNotificationDrawer: () => set((s) => ({ notificationDrawerOpen: !s.notificationDrawerOpen })),
```

---

## 5. Router Reorganization

### Add missing routes to `Router.tsx`:

```tsx
// Patient workspace additions
<Route path="/patients/:patientId/diagnoses" element={<PatientDiagnosesTab />} />
<Route path="/patients/:patientId/labs" element={<PatientLabsTab />} />

// Doctor workspace
<Route path="/clinical/today" element={<DoctorTodayPage />} />
<Route path="/clinical/waiting-room" element={<DoctorWaitingRoomPage />} />

// Billing additions
<Route path="/billing/payments" element={<RoutePermission permission="billing:read"><PaymentsPage /></RoutePermission>} />
<Route path="/billing/outstanding" element={<RoutePermission permission="billing:read"><OutstandingPage /></RoutePermission>} />

// Admin additions
<Route path="/admin/roles" element={<RoleGuard roles={["super_admin","org_admin"]}><RolesPermissionsPage /></RoleGuard>} />

// Reports
<Route path="/reports/appointments" element={<AppointmentReportsPage />} />
<Route path="/reports/revenue" element={<RevenueReportsPage />} />
```

---

## 6. Priority Quick Wins (< 2 hours each)

These can be done immediately to improve quality without major refactoring:

| Fix | File | Time |
|-----|------|------|
| Add `aria-label` to all icon-only buttons | PatientListPage, Topbar | 30 min |
| Add `role="alert"` to `AllergyBanner` | `AllergyBanner.tsx` | 5 min |
| Fix doctor UUID display in appointment list | `AppointmentListPage.tsx` | 1 hour |
| Add `type LoginState` to replace `(location.state as any)` | `LoginPage.tsx` | 10 min |
| Standardize `rowsPerPageOptions={[10, 20, 50]}` on all TablePagination | Multiple | 30 min |
| Add `aria-current="page"` to active nav items | `Sidebar.tsx`, `ContextNav.tsx` | 30 min |
| Format appointment dates using `formatDate` utility | `AppointmentListPage.tsx` | 20 min |
