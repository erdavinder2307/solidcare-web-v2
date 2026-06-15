import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { prescriptionsApi } from "../api/prescriptionsApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { clinicsApi } from "@/features/clinics/api/clinicsApi";
import { doctorsApi } from "@/features/doctors/api/doctorsApi";
import { formatDateTime } from "@/shared/utils/formatters";

const FREQ_LABELS: Record<string, string> = {
  OD: "Once daily",
  BD: "Twice daily",
  TDS: "Three times daily",
  QID: "Four times daily",
  SOS: "As needed",
  HS: "At bedtime",
  STAT: "Immediately",
  OW: "Once weekly",
  CUSTOM: "As directed",
};

const MEAL_LABELS: Record<string, string> = {
  before_food: "Before food",
  after_food: "After food",
  with_food: "With food",
  empty_stomach: "Empty stomach",
  any_time: "Any time",
};

export default function PrescriptionPrintPage() {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();

  const { data: rx } = useQuery({
    queryKey: ["prescription", prescriptionId],
    queryFn: () => prescriptionsApi.get(prescriptionId!),
    enabled: !!prescriptionId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", rx?.patient_id],
    queryFn: () => patientsApi.get(rx!.patient_id),
    enabled: !!rx?.patient_id,
  });

  const { data: clinic } = useQuery({
    queryKey: ["clinic", rx?.clinic_id],
    queryFn: () => clinicsApi.get(rx!.clinic_id),
    enabled: !!rx?.clinic_id,
  });

  const { data: doctor } = useQuery({
    queryKey: ["doctor", rx?.doctor_id],
    queryFn: () => doctorsApi.get(rx!.doctor_id),
    enabled: !!rx?.doctor_id,
  });

  // Auto-print once all data is loaded
  useEffect(() => {
    if (rx && patient && clinic && doctor) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [rx, patient, clinic, doctor]);

  if (!rx || !patient) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial, sans-serif", fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  const doctorName = doctor
    ? `Dr. ${doctor.first_name ?? ""} ${doctor.last_name ?? ""}`.trim()
    : "—";
  const qualifications = doctor?.qualifications?.join(", ") ?? "";
  const regNo = doctor?.registration_number ?? "";

  return (
    <>
      {/* ── Print-specific CSS injected via a <style> tag ── */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 16mm 16mm 20mm 16mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          a { color: inherit; text-decoration: none; }
        }

        body { margin: 0; padding: 0; background: #fff; }

        .rx-page {
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #1a1a1a;
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 28px;
          min-height: 100vh;
        }

        /* Header */
        .rx-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #1565c0;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .rx-clinic-name { font-size: 20px; font-weight: 700; color: #1565c0; }
        .rx-clinic-meta { font-size: 11px; color: #555; margin-top: 2px; }
        .rx-doctor-block { text-align: right; }
        .rx-doctor-name { font-size: 14px; font-weight: 700; }
        .rx-doctor-meta { font-size: 11px; color: #555; margin-top: 2px; }

        /* Patient block */
        .rx-patient-row {
          display: flex;
          gap: 24px;
          background: #f5f8ff;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 14px;
        }
        .rx-patient-field label { font-size: 10px; color: #888; display: block; margin-bottom: 2px; }
        .rx-patient-field span { font-size: 12px; font-weight: 600; }

        /* Diagnosis */
        .rx-section-title {
          font-size: 11px;
          font-weight: 700;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          margin-top: 14px;
        }
        .rx-diagnosis { font-size: 13px; margin-bottom: 4px; }

        /* Rx symbol */
        .rx-symbol {
          font-size: 40px;
          font-weight: 900;
          color: #1565c0;
          line-height: 1;
          margin: 14px 0 8px;
        }

        /* Medicine table */
        .rx-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .rx-table thead tr { background: #1565c0; color: #fff; }
        .rx-table thead th { padding: 7px 10px; text-align: left; font-size: 11px; font-weight: 600; }
        .rx-table tbody tr:nth-child(even) { background: #f0f4ff; }
        .rx-table tbody td { padding: 7px 10px; font-size: 12px; border-bottom: 1px solid #e0e0e0; vertical-align: top; }
        .rx-sno { color: #888; font-size: 11px; }

        /* Footer */
        .rx-footer {
          margin-top: 40px;
          border-top: 1px dashed #ccc;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .rx-notes { font-size: 11px; color: #555; max-width: 380px; }
        .rx-signature { text-align: center; font-size: 11px; }
        .rx-signature-line { border-top: 1px solid #555; width: 160px; margin: 0 auto 4px; margin-top: 40px; }

        /* Print action button (screen only) */
        .no-print {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          gap: 10px;
          z-index: 999;
        }
        .btn-print {
          background: #1565c0;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 10px 22px;
          font-size: 14px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-close {
          background: #e0e0e0;
          color: #333;
          border: none;
          border-radius: 6px;
          padding: 10px 22px;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>

      <div className="rx-page">
        {/* ── Header ── */}
        <div className="rx-header">
          <div>
            <div className="rx-clinic-name">{clinic?.name ?? "Clinic"}</div>
            <div className="rx-clinic-meta">
              {[clinic?.city, clinic?.state].filter(Boolean).join(", ")}
              {clinic?.phone ? ` · ${clinic.phone}` : ""}
              {clinic?.email ? ` · ${clinic.email}` : ""}
            </div>
          </div>
          <div className="rx-doctor-block">
            <div className="rx-doctor-name">{doctorName}</div>
            {qualifications && <div className="rx-doctor-meta">{qualifications}</div>}
            {regNo && <div className="rx-doctor-meta">Reg. No.: {regNo}</div>}
          </div>
        </div>

        {/* ── Patient info ── */}
        <div className="rx-patient-row">
          <div className="rx-patient-field">
            <label>Patient</label>
            <span>{patient.full_name}</span>
          </div>
          {patient.date_of_birth && (
            <div className="rx-patient-field">
              <label>Age / Sex</label>
              <span>
                {Math.floor((Date.now() - new Date(patient.date_of_birth).getTime()) / 31557600000)} yrs
                {patient.gender ? ` / ${patient.gender}` : ""}
              </span>
            </div>
          )}
          <div className="rx-patient-field">
            <label>Date</label>
            <span>{formatDateTime(rx.created_at)}</span>
          </div>
          <div className="rx-patient-field">
            <label>Ref. No.</label>
            <span>{rx.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        {/* ── Diagnosis ── */}
        {rx.diagnosis_summary && (
          <>
            <div className="rx-section-title">Diagnosis</div>
            <div className="rx-diagnosis">{rx.diagnosis_summary}</div>
          </>
        )}

        {/* ── Rx symbol + medicine table ── */}
        <div className="rx-symbol">℞</div>

        <table className="rx-table">
          <thead>
            <tr>
              <th style={{ width: 28 }}>#</th>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Timing</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            {rx.items.map((item, idx) => (
              <tr key={item.id}>
                <td className="rx-sno">{idx + 1}</td>
                <td style={{ fontWeight: 600 }}>{item.medicine_name}</td>
                <td>{item.dosage ?? "—"}</td>
                <td>{FREQ_LABELS[item.frequency] ?? item.frequency}</td>
                <td>{item.duration_days ? `${item.duration_days} days` : "—"}</td>
                <td>{MEAL_LABELS[item.meal_relation] ?? item.meal_relation}</td>
                <td>{item.instructions ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Footer ── */}
        <div className="rx-footer">
          <div className="rx-notes">
            {rx.notes && <><strong>Notes: </strong>{rx.notes}<br /></>}
            <span style={{ color: "#aaa", fontSize: 10 }}>
              This prescription is valid for 30 days from the date of issue.
              Controlled substances are dispensed only once.
            </span>
          </div>
          <div className="rx-signature">
            <div className="rx-signature-line" />
            {doctorName}
            {regNo && <div>Reg. {regNo}</div>}
          </div>
        </div>
      </div>

      {/* ── Screen-only print / close buttons ── */}
      <div className="no-print">
        <button className="btn-print" onClick={() => window.print()}>Print</button>
        <button className="btn-close" onClick={() => window.close()}>Close</button>
      </div>
    </>
  );
}
