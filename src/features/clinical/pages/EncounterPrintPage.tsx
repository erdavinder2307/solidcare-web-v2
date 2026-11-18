import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { encountersApi } from "../api/encountersApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { clinicsApi } from "@/features/clinics/api/clinicsApi";
import { doctorsApi } from "@/features/doctors/api/doctorsApi";
import { formatDateTime } from "@/shared/utils/formatters";

const ENCOUNTER_TYPE_LABELS: Record<string, string> = {
  opd: "OPD Consultation",
  ipd: "IPD",
  emergency: "Emergency",
  telemedicine: "Teleconsultation",
};

export default function EncounterPrintPage() {
  const { encounterId } = useParams<{ encounterId: string }>();

  const { data: encounter } = useQuery({
    queryKey: ["encounter", encounterId],
    queryFn: () => encountersApi.get(encounterId!),
    enabled: !!encounterId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", encounter?.patient_id],
    queryFn: () => patientsApi.get(encounter!.patient_id),
    enabled: !!encounter?.patient_id,
  });

  const { data: clinic } = useQuery({
    queryKey: ["clinic", encounter?.clinic_id],
    queryFn: () => clinicsApi.get(encounter!.clinic_id),
    enabled: !!encounter?.clinic_id,
  });

  const { data: doctor } = useQuery({
    queryKey: ["doctor", encounter?.doctor_id],
    queryFn: () => doctorsApi.get(encounter!.doctor_id),
    enabled: !!encounter?.doctor_id,
  });

  // Auto-print once all data is loaded
  useEffect(() => {
    if (encounter && patient && clinic && doctor) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [encounter, patient, clinic, doctor]);

  if (!encounter || !patient) {
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

  const sections = [
    { title: "Chief Complaint", value: encounter.chief_complaint },
    { title: "History of Present Illness", value: encounter.history_of_present_illness },
    { title: "General Examination", value: encounter.general_examination },
    { title: "Clinical Impression", value: encounter.clinical_impression },
    { title: "Treatment Plan", value: encounter.treatment_plan },
    { title: "Follow-up Instructions", value: encounter.follow_up_instructions },
  ].filter((s) => s.value);

  const vitals = encounter.vitals?.[0];

  return (
    <>
      {/* ── Print-specific CSS injected via a <style> tag ── */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 16mm 16mm 20mm 16mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          a { color: inherit; text-decoration: none; }
          .note-section { page-break-inside: avoid; }
        }

        body { margin: 0; padding: 0; background: #fff; }

        .note-page {
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #1a1a1a;
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 28px;
          min-height: 100vh;
        }

        /* Header */
        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #1565c0;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .note-clinic-name { font-size: 20px; font-weight: 700; color: #1565c0; }
        .note-clinic-meta { font-size: 11px; color: #555; margin-top: 2px; }
        .note-doctor-block { text-align: right; }
        .note-doctor-name { font-size: 14px; font-weight: 700; }
        .note-doctor-meta { font-size: 11px; color: #555; margin-top: 2px; }

        /* Title strip */
        .note-title {
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #444;
          margin-bottom: 14px;
        }

        /* Patient block */
        .note-patient-row {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          background: #f5f8ff;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 16px;
        }
        .note-patient-field label { font-size: 10px; color: #888; display: block; margin-bottom: 2px; }
        .note-patient-field span { font-size: 12px; font-weight: 600; }

        /* Vitals strip */
        .note-vitals {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 8px 14px;
          margin-bottom: 16px;
        }
        .note-vital label { font-size: 10px; color: #888; display: block; }
        .note-vital span { font-size: 12px; font-weight: 600; }

        /* Sections */
        .note-section { margin-bottom: 14px; }
        .note-section-title {
          font-size: 11px;
          font-weight: 700;
          color: #1565c0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .note-section-body { font-size: 12px; white-space: pre-wrap; line-height: 1.5; }

        /* Diagnoses */
        .note-dx-item { font-size: 12px; margin-bottom: 3px; }
        .note-dx-code { font-family: monospace; color: #1565c0; font-weight: 600; }
        .note-dx-type { color: #888; font-size: 11px; text-transform: capitalize; }

        /* Footer */
        .note-footer {
          margin-top: 40px;
          border-top: 1px dashed #ccc;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .note-attest { font-size: 11px; color: #2e7d32; max-width: 380px; }
        .note-signature { text-align: center; font-size: 11px; }
        .note-signature-line { border-top: 1px solid #555; width: 160px; margin: 40px auto 4px; }

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

      <div className="note-page">
        {/* ── Header ── */}
        <div className="note-header">
          <div>
            <div className="note-clinic-name">{clinic?.name ?? "Clinic"}</div>
            <div className="note-clinic-meta">
              {[clinic?.city, clinic?.state].filter(Boolean).join(", ")}
              {clinic?.phone ? ` · ${clinic.phone}` : ""}
              {clinic?.email ? ` · ${clinic.email}` : ""}
            </div>
          </div>
          <div className="note-doctor-block">
            <div className="note-doctor-name">{doctorName}</div>
            {qualifications && <div className="note-doctor-meta">{qualifications}</div>}
            {regNo && <div className="note-doctor-meta">Reg. No.: {regNo}</div>}
          </div>
        </div>

        <div className="note-title">
          Clinical Note — {ENCOUNTER_TYPE_LABELS[encounter.encounter_type] ?? encounter.encounter_type}
        </div>

        {/* ── Patient info ── */}
        <div className="note-patient-row">
          <div className="note-patient-field">
            <label>Patient</label>
            <span>{patient.full_name}</span>
          </div>
          {patient.date_of_birth && (
            <div className="note-patient-field">
              <label>Age / Sex</label>
              <span>
                {Math.floor((Date.now() - new Date(patient.date_of_birth).getTime()) / 31557600000)} yrs
                {patient.gender ? ` / ${patient.gender}` : ""}
              </span>
            </div>
          )}
          <div className="note-patient-field">
            <label>UHID</label>
            <span>{patient.uhid ?? "—"}</span>
          </div>
          <div className="note-patient-field">
            <label>Date</label>
            <span>{formatDateTime(encounter.encounter_date)}</span>
          </div>
          <div className="note-patient-field">
            <label>Ref. No.</label>
            <span>{encounter.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        {/* ── Vitals ── */}
        {vitals && (vitals.systolic_bp != null || vitals.pulse_rate != null || vitals.temperature != null || vitals.spo2 != null) && (
          <div className="note-vitals">
            {vitals.systolic_bp != null && (
              <div className="note-vital">
                <label>BP</label>
                <span>{vitals.systolic_bp}/{vitals.diastolic_bp ?? "—"} mmHg</span>
              </div>
            )}
            {vitals.pulse_rate != null && (
              <div className="note-vital">
                <label>Pulse</label>
                <span>{vitals.pulse_rate} bpm</span>
              </div>
            )}
            {vitals.temperature != null && (
              <div className="note-vital">
                <label>Temp</label>
                <span>{vitals.temperature} °C</span>
              </div>
            )}
            {vitals.spo2 != null && (
              <div className="note-vital">
                <label>SpO₂</label>
                <span>{vitals.spo2}%</span>
              </div>
            )}
          </div>
        )}

        {/* ── Diagnoses ── */}
        {encounter.diagnoses && encounter.diagnoses.length > 0 && (
          <div className="note-section">
            <div className="note-section-title">Diagnoses</div>
            {encounter.diagnoses.map((d, i) => (
              <div className="note-dx-item" key={i}>
                {d.icd10_code && <span className="note-dx-code">{d.icd10_code}</span>}{" "}
                {d.custom_description ?? ""}{" "}
                <span className="note-dx-type">({d.diagnosis_type})</span>
              </div>
            ))}
          </div>
        )}

        {/* ── SOAP sections ── */}
        {sections.map((s) => (
          <div className="note-section" key={s.title}>
            <div className="note-section-title">{s.title}</div>
            <div className="note-section-body">{s.value}</div>
          </div>
        ))}

        {/* ── Footer ── */}
        <div className="note-footer">
          <div className="note-attest">
            {encounter.attested_at ? (
              <>
                <strong>✓ Digitally attested</strong> on{" "}
                {formatDateTime(encounter.attested_at)}
              </>
            ) : (
              <span style={{ color: "#aaa", fontSize: 10 }}>
                This clinical note is a computer-generated record.
              </span>
            )}
          </div>
          <div className="note-signature">
            <div className="note-signature-line" />
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
