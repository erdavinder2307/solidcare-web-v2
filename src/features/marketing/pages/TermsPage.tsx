import React from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { COMPANY, SITE } from "../config/site";

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="Terms and conditions for use of the Solidcare healthcare platform."
      path="/terms"
    >
      <h2>1. Agreement</h2>
      <p>
        These Terms govern access to the Solidcare platform operated by {COMPANY.legalName}. By accessing{" "}
        {SITE.domain} or the Solidcare application, you agree to these Terms on behalf of yourself or your
        organization.
      </p>

      <h2>2. Authorized use</h2>
      <p>
        Solidcare is intended for authorized healthcare staff and administrators. You must use credentials issued
        by your organization and comply with applicable healthcare regulations, internal policies, and patient
        confidentiality obligations.
      </p>

      <h2>3. Account security</h2>
      <p>
        Users are responsible for safeguarding login credentials and MFA devices. Notify your administrator
        immediately if you suspect unauthorized access. Solidcare supports account lockout after repeated failed
        login attempts.
      </p>

      <h2>4. Platform availability</h2>
      <p>
        We strive for high availability but do not guarantee uninterrupted service. Maintenance, upgrades, or
        circumstances beyond our control may cause temporary downtime.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        Solidcare software, branding, and documentation are owned by {COMPANY.legalName}. Customer organizations
        retain ownership of their data entered into the platform subject to applicable agreements.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {COMPANY.legalName} is not liable for indirect or consequential
        damages arising from platform use. Clinical decisions remain the responsibility of licensed healthcare
        professionals and their institutions.
      </p>

      <h2>7. Governing law</h2>
      <p>
        These Terms are governed by the laws of India. Disputes shall be subject to the courts of Punjab, India,
        unless otherwise agreed in writing.
      </p>

      <h2>8. Contact</h2>
      <p>Email: {COMPANY.email}</p>
    </LegalPageLayout>
  );
}
