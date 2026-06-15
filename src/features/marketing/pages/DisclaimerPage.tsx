import React from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { COMPANY, SITE } from "../config/site";

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      description="Solidcare platform disclaimer for demonstration and healthcare software use."
      path="/disclaimer"
    >
      <h2>1. Not medical advice</h2>
      <p>
        Solidcare is healthcare operations software. It does not provide medical advice, diagnosis, or treatment.
        All clinical decisions are the sole responsibility of qualified healthcare professionals and their
        institutions.
      </p>

      <h2>2. Demonstration environment</h2>
      <p>
        Features, pricing, integrations, and compliance capabilities described on {SITE.domain} may reflect
        planned or in-development functionality. Demo environments may contain sample data not representing real
        patients.
      </p>

      <h2>3. Compliance statements</h2>
      <p>
        References to ABDM, FHIR, HIPAA, or DPDP indicate architectural readiness or roadmap direction. They do
        not constitute certification, accreditation, or legal compliance guarantees unless explicitly stated in a
        signed agreement.
      </p>

      <h2>4. Third-party services</h2>
      <p>
        Solidcare may integrate with cloud providers, messaging services, and future health information exchanges.
        {COMPANY.legalName} is not responsible for third-party service outages or policy changes.
      </p>

      <h2>5. Contact</h2>
      <p>{COMPANY.email}</p>
    </LegalPageLayout>
  );
}
