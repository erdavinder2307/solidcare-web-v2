import { APIRequestContext, request } from "@playwright/test";
import { DEFAULT_CLINIC_ID, E2E_DOCTOR_ID } from "../test-data/users";
import { createAppointment, createPatient, PatientData, uniquePhone, uniqueAppointmentSlot } from "../test-data/factories";

const API_URL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:8000/api/v1";

async function parseJson<T>(res: Awaited<ReturnType<APIRequestContext["post"]>>): Promise<T> {
  const text = await res.text();
  if (!res.ok()) {
    throw new Error(`API ${res.status()}: ${text}`);
  }
  return JSON.parse(text) as T;
}

export class ApiHelper {
  private token: string | null = null;

  static async create(): Promise<ApiHelper> {
    const helper = new ApiHelper();
    await helper.login("admin@solidcare.health", "Admin@1234");
    return helper;
  }

  async login(email: string, password: string): Promise<string> {
    const ctx = await request.newContext();
    const res = await ctx.post(`${API_URL}/auth/login`, { data: { email, password } });
    const body = await parseJson<{ access_token: string }>(res);
    this.token = body.access_token;
    await ctx.dispose();
    return this.token!;
  }

  private headers(): Record<string, string> {
    if (!this.token) throw new Error("Not authenticated");
    return { Authorization: `Bearer ${this.token}` };
  }

  async createPatient(data?: Partial<PatientData>): Promise<{ id: string; full_name: string; uhid: string }> {
    const ctx = await request.newContext();
    const generated = createPatient({ phone: uniquePhone(), ...data });
    const payload: Record<string, string> = {
      first_name: data?.first_name ?? generated.first_name,
      last_name: data?.last_name ?? generated.last_name,
      phone: data?.phone ?? generated.phone,
    };
    const res = await ctx.post(`${API_URL}/patients`, {
      headers: this.headers(),
      data: payload,
    });
    const body = await parseJson<{ id: string; full_name: string; uhid: string }>(res);
    await ctx.dispose();
    return body;
  }

  async createAppointment(
    patientId: string,
    doctorId = E2E_DOCTOR_ID,
    overrides: Partial<ReturnType<typeof createAppointment>> = {},
  ): Promise<{ id: string; token_number: number }> {
    const ctx = await request.newContext();
    const slot = uniqueAppointmentSlot();
    const appt = createAppointment({ ...slot, ...overrides });
    const res = await ctx.post(`${API_URL}/appointments`, {
      headers: this.headers(),
      data: {
        clinic_id: DEFAULT_CLINIC_ID,
        patient_id: patientId,
        doctor_id: doctorId,
        ...appt,
      },
    });
    const body = await parseJson<{ id: string; token_number: number }>(res);
    await ctx.dispose();
    return body;
  }

  async updateAppointmentStatus(appointmentId: string, status: string): Promise<void> {
    const ctx = await request.newContext();
    const res = await ctx.patch(`${API_URL}/appointments/${appointmentId}/status`, {
      headers: this.headers(),
      data: { status },
    });
    await parseJson(res);
    await ctx.dispose();
  }

  async createEncounter(patientId: string, appointmentId?: string): Promise<{ id: string }> {
    const ctx = await request.newContext();
    const res = await ctx.post(`${API_URL}/encounters`, {
      headers: this.headers(),
      data: {
        clinic_id: DEFAULT_CLINIC_ID,
        patient_id: patientId,
        doctor_id: E2E_DOCTOR_ID,
        appointment_id: appointmentId,
        encounter_type: "opd",
        chief_complaint: "E2E test encounter",
        vitals: { temperature: 37.0, pulse_rate: 72, systolic_bp: 120, diastolic_bp: 80 },
      },
    });
    const body = await parseJson<{ id: string }>(res);
    await ctx.dispose();
    return body;
  }

  async createPrescription(
    encounterId: string,
    patientId: string,
    doctorId = E2E_DOCTOR_ID,
  ): Promise<{ id: string }> {
    const ctx = await request.newContext();
    const res = await ctx.post(`${API_URL}/prescriptions`, {
      headers: this.headers(),
      data: {
        encounter_id: encounterId,
        patient_id: patientId,
        doctor_id: doctorId,
        clinic_id: DEFAULT_CLINIC_ID,
        items: [
          {
            medicine_name: "Paracetamol 500mg",
            dosage: "500mg",
            frequency: "BD",
            duration_days: 5,
            instructions: "After meals",
          },
        ],
      },
    });
    const body = await parseJson<{ id: string }>(res);
    await ctx.dispose();
    return body;
  }

  async createInvoice(patientId: string): Promise<{ id: string; invoice_number: string }> {
    const ctx = await request.newContext();
    const res = await ctx.post(`${API_URL}/billing/invoices`, {
      headers: this.headers(),
      data: {
        clinic_id: DEFAULT_CLINIC_ID,
        patient_id: patientId,
        invoice_date: new Date().toISOString().slice(0, 10),
        line_items: [
          {
            service_category: "consultation",
            description: "Consultation",
            quantity: 1,
            unit_price: 500,
          },
        ],
      },
    });
    const body = await parseJson<{ id: string; invoice_number: string }>(res);
    await ctx.dispose();
    return body;
  }

  async recordPayment(invoiceId: string, amount: number, patientId: string): Promise<void> {
    const ctx = await request.newContext();
    const res = await ctx.post(`${API_URL}/billing/payments`, {
      headers: this.headers(),
      data: {
        invoice_id: invoiceId,
        patient_id: patientId,
        clinic_id: DEFAULT_CLINIC_ID,
        amount,
        payment_method: "cash",
      },
    });
    await parseJson(res);
    await ctx.dispose();
  }

  async getPatient(patientId: string): Promise<Record<string, unknown>> {
    const ctx = await request.newContext();
    const res = await ctx.get(`${API_URL}/patients/${patientId}`, { headers: this.headers() });
    const body = await parseJson<Record<string, unknown>>(res);
    await ctx.dispose();
    return body;
  }

  async getInvoice(invoiceId: string): Promise<Record<string, unknown>> {
    const ctx = await request.newContext();
    const res = await ctx.get(`${API_URL}/billing/invoices/${invoiceId}`, { headers: this.headers() });
    const body = await parseJson<Record<string, unknown>>(res);
    await ctx.dispose();
    return body;
  }
}

export async function loginViaApi(email: string, password: string): Promise<string> {
  const ctx = await request.newContext();
  const res = await ctx.post(`${API_URL}/auth/login`, { data: { email, password } });
  const body = await parseJson<{ access_token: string }>(res);
  await ctx.dispose();
  return body.access_token;
}
