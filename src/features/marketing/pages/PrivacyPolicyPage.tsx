import React from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { COMPANY, SITE } from "../config/site";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="Solidcare privacy policy — how we collect, use, and protect information in the healthcare platform."
      path="/privacy"
    >
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy describes how {COMPANY.legalName} (&quot;we&quot;, &quot;us&quot;) processes information
        through the Solidcare platform ({SITE.domain}) and related services. Solidcare is a healthcare operations
        platform used by clinics and hospitals to manage patients, appointments, clinical records, prescriptions,
        and billing.
      </p>

      <h2>2. Roles and responsibilities</h2>
      <p>
        Healthcare providers using Solidcare typically act as data fiduciaries or controllers for patient health
        information. {COMPANY.legalName} acts as a technology service provider processing data on behalf of
        authorized provider organizations under applicable agreements.
      </p>

      <h2>3. Information we process</h2>
      <p>Through the Solidcare application, the platform may process:</p>
      <ul>
        <li>Patient demographics, contact details, and identifiers</li>
        <li>Clinical information including encounters, vitals, prescriptions, and documents</li>
        <li>Appointment and billing records</li>
        <li>Staff user accounts, roles, permissions, and authentication logs</li>
        <li>Audit trail entries for sensitive actions and PHI access</li>
        <li>Technical logs required for security and platform operation</li>
      </ul>

      <h2>4. How information is used</h2>
      <p>Information is used to:</p>
      <ul>
        <li>Provide healthcare operations functionality to authorized users</li>
        <li>Authenticate users, enforce RBAC, and maintain audit accountability</li>
        <li>Generate invoices, reports, and operational analytics for providers</li>
        <li>Maintain platform security, troubleshoot issues, and improve reliability</li>
      </ul>

      <h2>5. Security measures</h2>
      <p>
        Solidcare implements technical controls including JWT-based authentication, optional MFA, bcrypt password
        hashing, role-based access control, TLS encryption in transit, and immutable audit logging. Production
        deployments use Azure cloud infrastructure with segregated credentials.
      </p>

      <h2>6. Data retention</h2>
      <p>
        Retention periods for clinical and billing records are determined by the healthcare provider&apos;s policies
        and applicable law. Platform logs and audit records are retained as configured for security and compliance
        purposes.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Patients and users should contact their healthcare provider regarding access, correction, or deletion of
        health records. Platform users may contact us regarding account-related inquiries at {COMPANY.email}.
      </p>

      <h2>8. Contact</h2>
      <p>
        {COMPANY.legalName}
        <br />
        {COMPANY.address}
        <br />
        Email: {COMPANY.email}
      </p>
    </LegalPageLayout>
  );
}
