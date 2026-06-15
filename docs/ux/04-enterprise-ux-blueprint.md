# Solidcare V2 — Enterprise UX Blueprint
> Version 1.0 | 2026-06-11

---

## 1. Application Shell Architecture

### Layout Model: Three-Region Shell

```
┌──────────────────────────────────────────────────────────────┐
│  TOPBAR (52px fixed)                                         │
│  [≡] [Org › Clinic ▾]    [CMD+K Search]    [🔔] [Avatar ▾]  │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                  │
│  SIDEBAR   │  MAIN CONTENT AREA                              │
│  240px     │                                                  │
│  (collap-  │  [PageHeader + Breadcrumb]                      │
│  sible to  │  [ContextNav if applicable]                     │
│  56px)     │                                                  │
│            │  [Content]                                       │
│  [Nav]     │                                                  │
│            │                                                  │
│  ─────     │                                                  │
│  [Bottom   │                                                  │
│  items]    │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

### Topbar Anatomy (left → right)

```
[Sidebar Toggle] [Org/Clinic Switcher ▾] ............. [Search] [Notifications] [User Menu ▾]
```

- **Org/Clinic Switcher**: dropdown showing org name + clinic name. Click opens menu to switch clinic.
- **Global Search**: `Cmd+K` hotkey. Opens command palette (search patients, appointments, actions).
- **Notifications**: Bell icon with unread count badge. Click opens notification panel (right slide-in).
- **User Menu**: Avatar + name. Dropdown: Profile, Settings, Density, Logout.

### Sidebar Anatomy

```
┌────────────────────┐
│ [●] Solidcare      │  ← Logo + Org name (click = home)
│     Org Name       │
├────────────────────┤
│                    │
│  Overview          │  ← Group label (hidden when collapsed)
│  ○ Dashboard       │
│                    │
│  Patients          │
│  ○ Patient Registry│
│                    │
│  Appointments      │
│  ○ Schedule        │
│  ○ Waiting Room    │
│                    │
│  Clinical          │
│  ○ My Today   [●]  │  ← Doctor-only, dot = has pending
│  ○ Encounters      │
│                    │
│  Billing           │
│  ○ Invoices   [3]  │  ← Badge count for outstanding
│                    │
│  Reports           │
│  ○ Reports         │
│                    │
├────────────────────┤
│  ○ Audit Log       │  ← Bottom section
│  ○ Admin           │
│  ○ Settings        │
└────────────────────┘
```

**Collapsed state (56px):** icons only, group labels hidden, item badges visible as dots.

---

## 2. Dashboard Designs (Role-Based)

### 2.1 Doctor Dashboard

**Philosophy:** Action-first. First thing a doctor sees when they log in is: *who is waiting for me?*

```
┌─────────────────────────────────────────────────────────────┐
│ Good morning, Dr. Patel — Wednesday 11 June 2026            │
├───────────┬───────────┬───────────┬─────────────────────────┤
│ 12        │ 3         │ 8         │  1 IN CONSULTATION      │
│ Today     │ Waiting   │ Completed │  ████████████████ 67%   │
│ scheduled │           │           │  Token #4 | Priya R.    │
├───────────┴───────────┴───────────┴─────────────────────────┤
│ WAITING ROOM                                [Call Next ▶]   │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ #3  Amit Sharma     9:30 AM   GP Visit   Waiting 22m │    │
│ │ #5  Riya Desai      10:00 AM  Follow-up  Waiting 8m  │    │
│ │ #7  Mohan Kumar     10:15 AM  GP Visit   Checked In  │    │
│ └──────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│ UPCOMING TODAY (scroll)                                      │
│ 11:00  Priya Rao      · Follow-up                           │
│ 11:30  Kumar Singh    · New Patient                         │
│ 12:00  ─── Lunch Break ───                                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Receptionist Dashboard

**Philosophy:** Queue management + booking triage.

```
┌─────────────────────────────────────────────────────────────┐
│ Reception — Clinic A   Wednesday 11 June 2026               │
├───────────┬───────────┬─────────────────────────────────────┤
│ 24        │ 6         │ Quick Actions                        │
│ Today     │ Checked   │ [+ Book Appointment]                 │
│ total     │ In        │ [+ Register Patient]                 │
├───────────┴───────────┤ [Check In Patient  ]                 │
│ QUEUE STATUS          └─────────────────────────────────────┤
│ Dr. Patel    ████░░░░  Token #4  (3 waiting)                 │
│ Dr. Shah     ██░░░░░░  Token #2  (5 waiting)                 │
│ Dr. Mishra   ░░░░░░░░  Token —   (not started)               │
├─────────────────────────────────────────────────────────────┤
│ RECENT CHECK-INS                                             │
│ 10:22  Amit Sharma    · Dr. Patel  · Token #3   CHECKED IN  │
│ 10:18  Riya Desai     · Dr. Patel  · Token #5   WAITING     │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Clinic Admin / Org Admin Dashboard

**Philosophy:** Operational metrics + staff productivity overview.

```
┌─────────────────────────────────────────────────────────────┐
│ Clinic A Overview  — June 2026                              │
├──────────┬──────────┬──────────┬────────────────────────────┤
│ 248      │ ₹84,200  │ 94%      │ 12                         │
│ Appts    │ Revenue  │ Occupancy│ Overdue Invoices            │
│ this wk  │ this wk  │ avg      │                            │
├──────────┴──────────┴──────────┴────────────────────────────┤
│ REVENUE 30 DAYS          │ APPOINTMENTS 30 DAYS             │
│ [Line chart]             │ [Bar chart — by doctor]          │
├──────────────────────────┴──────────────────────────────────┤
│ DOCTOR PRODUCTIVITY                                          │
│ Dr. Patel     ████████████░░  48 pts  ₹32,400               │
│ Dr. Shah      ████████░░░░░░  38 pts  ₹28,100               │
│ Dr. Mishra    ██████░░░░░░░░  29 pts  ₹18,600               │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Billing Staff Dashboard

**Philosophy:** Outstanding-first. Revenue recovery focus.

```
┌─────────────────────────────────────────────────────────────┐
│ Billing Overview                                            │
├──────────┬──────────┬──────────────────────────────────────┤
│ ₹1,24,500│ ₹38,200  │ 23                                   │
│ Total    │ Overdue  │ Invoices awaiting payment             │
│ unpaid   │ 30+ days │                                       │
├──────────┴──────────┴──────────────────────────────────────┤
│ OVERDUE INVOICES                             [View All →]   │
│ INV-0089  Amit Sharma      ₹2,400   45 days overdue        │
│ INV-0072  Priya Rao        ₹1,800   38 days overdue        │
│ INV-0061  Kumar Singh      ₹3,200   32 days overdue        │
├─────────────────────────────────────────────────────────────┤
│ TODAY'S COLLECTIONS                                          │
│ ₹8,400 collected from 6 payments                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Patient Workspace Blueprint

### 3.1 Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Patients › John Smith                           │
├─────────────────────────────────────────────────────────────┤
│ [!] ALLERGY BANNER: Penicillin (High), Aspirin (Medium)    │  ← role="alert"
├─────────────────────────────────────────────────────────────┤
│ STICKY PATIENT IDENTITY BAR                                  │
│ [JD] John Smith · SC-0001 · M, 42y · B+  [Active ●]       │
│      +91 98765 43210 · ABHA linked                          │
│                         [Book] [Invoice] [Encounter] [Edit] │
├─────────────────────────────────────────────────────────────┤
│ Overview | Timeline | Appointments | Encounters | Diagnoses  │
│ Prescriptions | Labs | Documents | Billing | Audit          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB CONTENT AREA                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Overview Tab Layout

```
┌────────────────────────────┬────────────────────────────────┐
│ CLINICAL SUMMARY           │ RECENT ACTIVITY                │
│ Active conditions: 2       │ 11 Jun — Consultation          │
│ Current meds: 3            │ 04 Jun — Invoice ₹800          │
│ Allergies: 2               │ 28 May — Prescription          │
│ Last visit: 4 Jun 2026     │                                │
├────────────────────────────┴────────────────────────────────┤
│ DEMOGRAPHICS                                                  │
│ Email · Address · City · Blood Group · Emergency Contact    │
├─────────────────────────────────────────────────────────────┤
│ UPCOMING APPOINTMENTS                                        │
│ 15 Jun 2026  10:00  Dr. Patel  Follow-up  [Confirmed ●]    │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Doctor Workspace (Consultation) Blueprint

### 4.1 Split Layout Design

```
┌──────────────────────────┬──────────────────────────────────┐
│ PATIENT CHART (35%)      │ CONSULTATION NOTES (65%)         │
│                          │                                   │
│ [JD] John Smith          │ Chief Complaint *                 │
│ SC-0001 · M 42y · B+    │ ┌────────────────────────────┐   │
│ [!] Penicillin allergy   │ │                            │   │
│                          │ └────────────────────────────┘   │
│ ACTIVE CONDITIONS        │                                   │
│ ● Type 2 Diabetes        │ History of Present Illness        │
│ ● Hypertension           │ ┌────────────────────────────┐   │
│                          │ │                            │   │
│ CURRENT MEDICATIONS      │ └────────────────────────────┘   │
│ Metformin 500mg          │                                   │
│ Amlodipine 5mg           │ VITALS                            │
│                          │ BP [___/___] Pulse [___]          │
│ PAST VISITS (3)          │ Temp [___]   SpO2 [___]           │
│ ▸ 04 Jun — GP Visit      │                                   │
│ ▸ 12 May — Follow-up     │ Clinical Impression               │
│                          │ ┌────────────────────────────┐   │
│ ALLERGIES                │ │                            │   │
│ Penicillin — HIGH        │ └────────────────────────────┘   │
│                          │                                   │
│                          │ [+ Add Prescription]  [+ ICD-10] │
│                          │                                   │
│                          │ [Save Draft]    [Complete ✓]      │
└──────────────────────────┴──────────────────────────────────┘
```

**Critical requirements:**
- Left panel is read-only, scrollable independently
- Right panel autosaves every 30s (draft persistence)
- `[+ Add Prescription]` opens inline prescription builder — no page navigation
- Vitals show real-time range indicators (BP > 140/90 = amber highlight)

---

## 5. Data Table Standards

### 5.1 Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ Table Title              [Search…]  [Filter ▾] [Columns ▾] │
│                                                 [Export ▾]  │
├──────────┬─────────────┬──────────┬──────────┬─────────────┤
│ ☐  Pat.  │ UHID   ↕   │ Doctor ↕ │ Date  ↓  │ Status      │
├──────────┼─────────────┼──────────┼──────────┼─────────────┤
│ ☐ [JD]  │ SC-0001    │ Dr. Patel│ 11 Jun   │ [Completed] │
│ ☐ [RS]  │ SC-0002    │ Dr. Shah │ 11 Jun   │ [Waiting  ] │
├──────────┴─────────────┴──────────┴──────────┴─────────────┤
│ Showing 1-20 of 248                    [< 1 2 3 ... 13 >]  │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Table Requirements

| Feature | Priority | Implementation |
|---------|----------|----------------|
| Column sorting | Must | Click header → asc → desc → none |
| Global search | Must | Debounced 300ms, clears on Esc |
| Column visibility | Should | Dropdown checkboxes, persisted in localStorage |
| Row selection (bulk) | Should | Checkbox column, select-all header |
| Bulk actions | Should | Floating action bar appears when rows selected |
| Export | Should | CSV export of current filtered view |
| Filter chips | Should | Active filters shown as dismissible chips |
| Date range filter | Should | Appointment date, DOB, invoice date |
| Pagination | Must | 10 / 20 / 50 per page |
| Loading state | Must | Skeleton rows (not spinner) |
| Empty state | Must | Contextual illustration + action CTA |
| Row click | Context | Navigate to detail or open flyout |

### 5.3 Column Defaults by Table

**Patient List:** Name+Avatar | UHID | Phone | Gender+Age | Blood Group | Status | Actions

**Appointment List:** Date+Time | Token | Patient | Doctor | Type | Status | Chief Complaint

**Encounter List:** Date | Patient | Doctor | Diagnosis | Type | Status

**Invoice List:** Invoice# | Patient | Date | Amount | Paid | Outstanding | Status

---

## 6. Form Standards

### 6.1 Patient Registration (Multi-step)

```
Step 1: Personal        — Full name, DOB, Gender, Blood group, ABHA
Step 2: Contact         — Phone, Email, Address, City, Pincode
Step 3: Medical         — Allergies, Medical history, Emergency contact
Step 4: Insurance       — Insurance provider, policy number (optional)
Step 5: Review & Submit
```

### 6.2 Appointment Booking

```
Step 1: Patient         — Search/select existing or quick register
Step 2: Doctor + Slot   — Doctor picker, available slots calendar
Step 3: Details         — Type, chief complaint, notes
Step 4: Confirm
```

### 6.3 Vitals Entry (Inline in Consultation)

- Numeric inputs with unit suffix (mmHg, bpm, °F, %)
- Range validation with color feedback:
  - Normal: no highlight
  - Warning: `warning.bg` background
  - Critical: `danger.bg` background + icon
- NEVER show raw "invalid" error — show "Value outside normal range"

### 6.4 Form Design Rules

1. **Max 2 columns** on desktop — never 3+ column forms
2. **Group related fields** with labeled `FormSection` (border + heading)
3. **Required fields** marked with `*` — asterisk before field label
4. **Validation** fires on `blur` not `onChange` (reduces noise)
5. **Primary action** always bottom-right; secondary (cancel) bottom-left
6. **Destructive actions** require confirmation dialog — never inline

---

## 7. Command Palette (Cmd+K)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Search patients, appointments, actions…                  │
├─────────────────────────────────────────────────────────────┤
│ PATIENTS                                                     │
│  [JD] John Smith — SC-0001 — +91 98765 43210               │
│  [RS] Riya Shah — SC-0047 — +91 87654 32109                │
│                                                              │
│ QUICK ACTIONS                                                │
│  ⚡ Book Appointment                                         │
│  ⚡ Register Patient                                         │
│  ⚡ Create Invoice                                           │
│                                                              │
│ NAVIGATION                                                   │
│  → Waiting Room (/appointments/queue)                        │
│  → Reports (/reports)                                        │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:** `cmdk` library or custom `Dialog` + search.  
**Keyboard:** `Cmd+K` opens, `Esc` closes, `↑↓` navigate, `Enter` selects.

---

## 8. Notification Panel

```
┌────────────────────────────────┐
│ Notifications     [Mark all ✓]│
├────────────────────────────────┤
│ ● Appointment confirmed        │ ← unread (brand bg)
│   John Smith · 15 Jun 10:00   │
│   2 minutes ago                │
├────────────────────────────────┤
│   Invoice overdue              │
│   INV-0089 · Amit Sharma      │
│   3 hours ago                  │
├────────────────────────────────┤
│   New patient registered       │
│   Priya Rao · SC-0489         │
│   Yesterday                    │
└────────────────────────────────┘
```

Implemented as a `Drawer` anchored right, `400px` wide, not a `Menu`.

---

## 9. Accessibility Blueprint

### WCAG 2.1 AA Requirements

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Color contrast (normal text) | ≥ 4.5:1 | Use neutral[700] on neutral[0] = 7.2:1 ✓ |
| Color contrast (large text) | ≥ 3:1 | brand[600] on neutral[0] = 5.1:1 ✓ |
| Focus visible | Always | Custom focus ring: `box-shadow: 0 0 0 3px brand[200]` |
| Keyboard navigation | All interactive | `tabIndex`, `onKeyDown` Enter/Space for custom controls |
| Screen reader | All elements | `aria-label`, `aria-describedby`, semantic HTML |
| Skip to content | App shell | `<a href="#main-content" className="skip-link">` |
| Alert announcements | Status changes | `role="alert"` on allergy banners, toasts |
| Form labels | All inputs | `<label>` or `aria-label`, never placeholder-only |
| Loading states | All async | `aria-busy`, `aria-live="polite"` regions |

### Focus Management Rules
1. Modal opens → focus moves to first interactive element
2. Modal closes → focus returns to trigger element
3. Route change → focus moves to page heading `<h1>` or `#main-content`
4. Notification panel open → focus trap inside panel

---

## 10. Responsive Breakpoint Strategy

| Breakpoint | Width | Layout Behavior |
|-----------|-------|-----------------|
| xs | < 640px | Mobile: no sidebar (bottom drawer), full-width content |
| sm | 640–1024px | Tablet: collapsed sidebar (56px), single-column content |
| md | 1024–1280px | Laptop: full sidebar (240px), standard layout |
| lg | 1280–1536px | Desktop: standard layout, wider content |
| xl | > 1536px | Wide: max-width container (1440px), centered |

### Priority Hierarchy
1. **Desktop/Laptop (md+)** — primary design target; 80%+ of healthcare users
2. **Tablet (sm)** — secondary; ward rounds, bedside use
3. **Mobile (xs)** — minimal; basic lookup only (patient search, schedule view)
