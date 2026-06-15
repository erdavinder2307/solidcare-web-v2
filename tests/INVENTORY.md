# Solidcare V2 — Feature & Route Inventory (E2E Reference)

## User Roles

| Role | Email | Permissions Summary |
|------|-------|---------------------|
| Super Admin | admin@solidcare.health | All |
| Org Admin | orgadmin@solidcare.health | All org modules |
| Doctor | doctor@solidcare.health | Clinical, read patients |
| Receptionist | receptionist@solidcare.health | Patients, appointments |
| Billing Clerk | billing@solidcare.health | Billing, read patients |

## Route Inventory

| Path | Feature | Permission |
|------|---------|------------|
| /login | Auth | Public |
| /dashboard | Dashboard | Auth |
| /patients | Patient list | patient:read |
| /patients/new | Register patient | patient:create |
| /patients/:id | Patient workspace | patient:read |
| /appointments | Schedule | appointment:read |
| /appointments/new | Book appointment | appointment:create |
| /appointments/queue | Waiting room | appointment:read |
| /clinical/workspace | Doctor today | encounter:read |
| /encounters | Encounters | encounter:read |
| /prescriptions | Prescriptions | prescription:read |
| /billing/invoices | Invoices | billing:read |
| /admin/users | Users | admin role |
| /admin/clinics | Clinics | admin role |
| /settings | Settings | Auth |

## Workflow Inventory

1. Register Patient → Book Appointment → Check-In → Consultation → Encounter
2. Create Prescription → Finalize
3. Generate Invoice → Record Payment
4. Role-based navigation and access control
