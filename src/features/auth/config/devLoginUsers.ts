/** Local-dev quick-login accounts (seeded via solidcare-api-v2/scripts/seed_dev_rbac_users.sql). */
export interface DevLoginUser {
  email: string;
  password: string;
  label: string;
  role: string;
}

export const DEV_LOGIN_PASSWORD = "Admin@1234";

export const DEV_LOGIN_USERS: DevLoginUser[] = [
  {
    email: "admin@solidcare.health",
    password: DEV_LOGIN_PASSWORD,
    label: "Super Admin",
    role: "superadmin",
  },
  {
    email: "orgadmin@solidcare.health",
    password: DEV_LOGIN_PASSWORD,
    label: "Org Admin",
    role: "admin",
  },
  {
    email: "doctor@solidcare.health",
    password: DEV_LOGIN_PASSWORD,
    label: "Doctor",
    role: "doctor",
  },
  {
    email: "receptionist@solidcare.health",
    password: DEV_LOGIN_PASSWORD,
    label: "Receptionist",
    role: "receptionist",
  },
  {
    email: "billing@solidcare.health",
    password: DEV_LOGIN_PASSWORD,
    label: "Billing Clerk",
    role: "billing_clerk",
  },
];
