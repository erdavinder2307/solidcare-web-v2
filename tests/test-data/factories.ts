import { faker } from "@faker-js/faker";

export interface PatientData {
  first_name: string;
  last_name: string;
  phone: string;
  gender?: string;
  email?: string;
  city?: string;
  state?: string;
}

export function createPatient(overrides: Partial<PatientData> = {}): PatientData {
  const first = overrides.first_name ?? faker.person.firstName();
  const last = overrides.last_name ?? faker.person.lastName();
  return {
    first_name: first,
    last_name: last,
    phone: overrides.phone ?? faker.string.numeric(10),
    gender: overrides.gender ?? "male",
    email: overrides.email ?? faker.internet.email({ firstName: first, lastName: last }),
    city: overrides.city ?? "Chandigarh",
    state: overrides.state ?? "Punjab",
    ...overrides,
  };
}

export interface AppointmentData {
  appointment_date: string;
  start_time: string;
  appointment_type: string;
  chief_complaint?: string;
}

export function createAppointment(overrides: Partial<AppointmentData> = {}): AppointmentData {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    appointment_date: overrides.appointment_date ?? tomorrow.toISOString().slice(0, 10),
    start_time: overrides.start_time ?? "10:00",
    appointment_type: overrides.appointment_type ?? "scheduled",
    chief_complaint: overrides.chief_complaint ?? "Routine checkup",
    ...overrides,
  };
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export function createInvoiceLineItem(
  overrides: Partial<InvoiceLineItem> = {},
): InvoiceLineItem {
  return {
    description: overrides.description ?? "Consultation fee",
    quantity: overrides.quantity ?? 1,
    unit_price: overrides.unit_price ?? 500,
    ...overrides,
  };
}

export function uniquePhone(): string {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-9);
  return `9${suffix}`;
}

export function uniqueAppointmentSlot(): { appointment_date: string; start_time: string } {
  const date = new Date();
  date.setDate(date.getDate() + 14 + (Date.now() % 7));
  const totalMins = 480 + (Date.now() % 420);
  const hours = Math.floor(totalMins / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMins % 60).toString().padStart(2, "0");
  return {
    appointment_date: date.toISOString().slice(0, 10),
    start_time: `${hours}:${minutes}`,
  };
}
