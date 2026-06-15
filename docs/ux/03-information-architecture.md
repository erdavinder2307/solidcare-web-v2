# Solidcare V2 — Information Architecture
> Version 1.0 | 2026-06-11

---

## 1. Navigation Hierarchy

```
Solidcare
├── Overview
│   └── Dashboard (role-adaptive)
│
├── Patients
│   ├── Patient Registry          /patients
│   ├── Register Patient          /patients/new
│   └── [Patient Workspace]       /patients/:id
│       ├── Overview              /patients/:id/overview
│       ├── Timeline              /patients/:id/timeline
│       ├── Appointments          /patients/:id/appointments
│       ├── Encounters            /patients/:id/encounters
│       ├── Diagnoses             /patients/:id/diagnoses       ← NEW
│       ├── Prescriptions         /patients/:id/prescriptions
│       ├── Lab Results           /patients/:id/labs            ← NEW
│       ├── Documents             /patients/:id/documents
│       ├── Billing               /patients/:id/billing         (billing:read)
│       └── Audit                 /patients/:id/audit           (audit:read)
│
├── Appointments
│   ├── Schedule                  /appointments
│   ├── Book Appointment          /appointments/new
│   ├── Waiting Room / Queue      /appointments/queue
│   └── Appointment Detail        /appointments/:id
│
├── Clinical
│   ├── My Today [Doctor]         /clinical/today               (doctor role)
│   ├── Waiting Room [Doctor]     /clinical/waiting-room        (doctor role)
│   ├── Encounters                /encounters
│   ├── Encounter Detail          /encounters/:id
│   └── Consultation              /consultation/:appointmentId
│
├── Prescriptions
│   ├── Prescription List         /prescriptions
│   ├── Create Prescription       /prescriptions/new
│   └── Prescription Detail       /prescriptions/:id
│
├── Billing
│   ├── Invoices                  /billing/invoices
│   ├── Create Invoice            /billing/invoices/new
│   ├── Invoice Detail            /billing/invoices/:id
│   ├── Payments                  /billing/payments             ← NEW
│   └── Outstanding               /billing/outstanding          ← NEW
│
├── Reports
│   ├── Overview                  /reports
│   ├── Appointment Reports       /reports/appointments
│   ├── Revenue Reports           /reports/revenue
│   ├── Clinical Reports          /reports/clinical
│   └── Custom Report Builder     /reports/builder              ← Future
│
└── Administration
    ├── Users                     /admin/users
    ├── Roles & Permissions       /admin/roles                  ← NEW
    ├── Clinics                   /admin/clinics
    ├── Clinic Detail             /admin/clinics/:id
    ├── Organizations             /admin/organizations
    ├── Audit Log                 /admin/audit
    └── Settings                  /settings
```

---

## 2. Primary Navigation Groups

### Group: Overview
| Item | Route | Icon | Permission |
|------|-------|------|------------|
| Dashboard | /dashboard | DashboardOutlined | null |

### Group: Patients
| Item | Route | Icon | Permission |
|------|-------|------|------------|
| Patient Registry | /patients | PeopleOutlined | patient:read |

### Group: Appointments
| Item | Route | Icon | Permission |
|------|-------|------|------------|
| Schedule | /appointments | CalendarMonthOutlined | appointment:read |
| Waiting Room | /appointments/queue | QueuePlayNextOutlined | appointment:read |

### Group: Clinical
| Item | Route | Icon | Permission | Roles |
|------|-------|------|------------|-------|
| My Today | /clinical/today | TodayOutlined | encounter:read | doctor |
| Waiting Room | /clinical/waiting-room | PersonPinOutlined | encounter:read | doctor |
| Encounters | /encounters | MedicalServicesOutlined | encounter:read | — |

### Group: Prescriptions
| Item | Route | Icon | Permission |
|------|-------|------|------------|
| Prescriptions | /prescriptions | DescriptionOutlined | prescription:read |

### Group: Billing
| Item | Route | Icon | Permission |
|------|-------|------|------------|
| Invoices | /billing/invoices | ReceiptOutlined | billing:read |
| Payments | /billing/payments | PaymentsOutlined | billing:read |

### Group: Reports
| Item | Route | Icon | Permission |
|------|-------|------|------------|
| Reports | /reports | BarChartOutlined | report:read |

### Group: Administration (bottom)
| Item | Route | Icon | Permission | Roles |
|------|-------|------|------------|-------|
| Audit Log | /admin/audit | SecurityOutlined | audit:read | — |
| Users | /admin/users | GroupOutlined | user:read | — |
| Clinics | /admin/clinics | LocalHospitalOutlined | clinic:read | — |
| Settings | /settings | SettingsOutlined | null | — |

---

## 3. Patient Workspace Navigation

```
Patient: John Smith (UHID: SC-0001)
[Allergy Banner if applicable]

Tab Nav:
Overview | Timeline | Appointments | Encounters | Diagnoses | Prescriptions | Labs | Documents | Billing | Audit
```

### Tab Definitions

| Tab | Route Suffix | Content | Permission |
|-----|-------------|---------|------------|
| Overview | /overview | Demographics, active conditions, recent activity, KPIs | patient:read |
| Timeline | /timeline | Chronological event feed | patient:read |
| Appointments | /appointments | Patient's appointment history + upcoming | appointment:read |
| Encounters | /encounters | Clinical encounters list | encounter:read |
| Diagnoses | /diagnoses | Active + past diagnoses (ICD-10) | encounter:read |
| Prescriptions | /prescriptions | Medication history | prescription:read |
| Labs | /labs | Lab orders + results | encounter:read |
| Documents | /documents | Uploaded files, reports | patient:read |
| Billing | /billing | Invoices, payments, outstanding | billing:read |
| Audit | /audit | Change history for compliance | audit:read |

---

## 4. Doctor Workspace Navigation

```
Dr. [Name] — Clinical Workspace

Tab Nav:
Today | Waiting Room | Schedule
```

| Tab | Route | Content |
|-----|-------|---------|
| Today | /clinical/today | Today's appointments, stats, current patient alert |
| Waiting Room | /clinical/waiting-room | Queue with check-in status, call next |
| Schedule | /clinical/schedule | Weekly calendar view (future) |

---

## 5. Breadcrumb Strategy

### Rules
1. Top-level pages: no breadcrumbs (you are at root)
2. Second-level pages: `[Section]` only
3. Detail pages: `[Section] › [Entity Name]`
4. Nested workspace tabs: `[Section] › [Entity Name]` (tab label not in breadcrumb)
5. Actions: `[Section] › [Entity Name] › [Action]` (e.g. `Patients › John Smith › Edit`)

### Examples

| Page | Breadcrumb |
|------|-----------|
| Dashboard | *(none)* |
| Patient List | *(none — top level)* |
| Patient Workspace | `Patients › John Smith (SC-0001)` |
| Patient Overview Tab | `Patients › John Smith (SC-0001)` |
| Patient Edit | `Patients › John Smith (SC-0001) › Edit` |
| Appointment Book | `Appointments › Book Appointment` |
| Consultation | `Clinical › Consultation · Token #12` |
| Invoice Detail | `Billing › Invoice #INV-0042` |

---

## 6. URL Structure Conventions

```
/[module]/[action or list]         — module root
/[module]/new                      — create action
/[module]/:id                      — detail / workspace root
/[module]/:id/edit                 — edit action
/[module]/:id/[sub-resource]       — nested resource
/[module]/:id/[tab]                — workspace tab
```

**Example:**
```
/patients                          — patient list
/patients/new                      — register patient
/patients/pt_abc123                — patient workspace (redirects to /overview)
/patients/pt_abc123/overview       — overview tab
/patients/pt_abc123/encounters     — encounters tab
/patients/pt_abc123/edit           — edit patient
```

---

## 7. Role-Based Navigation Visibility

| Navigation Item | super_admin | org_admin | clinic_admin | doctor | receptionist | billing_staff |
|----------------|-------------|-----------|--------------|--------|--------------|---------------|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Patients | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Schedule | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Waiting Room | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| My Today | — | — | — | ✓ | — | — |
| Clinical/Encounters | ✓ | ✓ | ✓ | ✓ | — | — |
| Prescriptions | ✓ | ✓ | ✓ | ✓ | — | — |
| Billing | ✓ | ✓ | ✓ | — | — | ✓ |
| Reports | ✓ | ✓ | ✓ | — | — | ✓ |
| Admin / Users | ✓ | ✓ | ✓ | — | — | — |
| Audit Log | ✓ | ✓ | — | — | — | — |
| Settings | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
