import React from "react";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { COMPANY, SITE } from "../config/site";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="How Solidcare uses cookies and similar technologies on the public website and application."
      path="/cookies"
    >
      <h2>1. Overview</h2>
      <p>
        This Cookie Policy explains how {SITE.domain} and the Solidcare application use cookies and local storage
        technologies operated by {COMPANY.legalName}.
      </p>

      <h2>2. Application authentication</h2>
      <p>
        The Solidcare staff application stores authentication tokens in browser local storage (via the application
        state layer) to maintain your signed-in session. These are essential for platform functionality and are
        not used for advertising.
      </p>

      <h2>3. Public website</h2>
      <p>
        The public marketing website may use minimal session or preference cookies required for basic operation.
        We do not use third-party advertising cookies on the Solidcare platform.
      </p>

      <h2>4. Managing cookies</h2>
      <p>
        You can control cookies through your browser settings. Disabling essential storage may prevent login and
        use of the Solidcare application.
      </p>

      <h2>5. Contact</h2>
      <p>Questions: {COMPANY.email}</p>
    </LegalPageLayout>
  );
}
