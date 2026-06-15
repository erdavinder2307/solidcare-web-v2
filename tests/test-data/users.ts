export interface TestUser {
  email: string;
  password: string;
  role: string;
  displayName: string;
}

export const TEST_USERS = {
  superAdmin: {
    email: "admin@solidcare.health",
    password: "Admin@1234",
    role: "superadmin",
    displayName: "Super Admin",
  },
  orgAdmin: {
    email: "orgadmin@solidcare.health",
    password: "Admin@1234",
    role: "admin",
    displayName: "Organization Admin",
  },
  doctor: {
    email: "doctor@solidcare.health",
    password: "Admin@1234",
    role: "doctor",
    displayName: "Doctor",
  },
  receptionist: {
    email: "receptionist@solidcare.health",
    password: "Admin@1234",
    role: "receptionist",
    displayName: "Receptionist",
  },
  billingClerk: {
    email: "billing@solidcare.health",
    password: "Admin@1234",
    role: "billing_clerk",
    displayName: "Billing Clerk",
  },
} as const satisfies Record<string, TestUser>;

export const DEFAULT_CLINIC_ID = "00000000-0000-0000-0000-000000000010";
export const E2E_DOCTOR_ID = "00000000-0000-0000-0000-000000000030";
