/** Public website constants — Solidev Electrosoft contact details. */

export const SITE = {
  name: "Solidcare",
  tagline: "Enterprise Healthcare Operations Platform",
  domain: "https://solidcare.org",
  description:
    "Solidcare is a modern healthcare operations platform for clinics, hospitals, and healthcare chains in India. Patients, appointments, clinical workflows, prescriptions, and billing in one secure system.",
} as const;

export const COMPANY = {
  legalName: "Solidev Electrosoft OPC Private Limited",
  productLine: "Solidcare is a healthcare platform by Solidev Electrosoft.",
  founded: 2018,
  email: "admin@solidevelectrosoft.com",
  phone: "+91 911-586-6828",
  whatsapp: "919115866828",
  whatsappUrl: "https://wa.me/919115866828?text=Hi%2C%20I%27d%20like%20to%20request%20a%20Solidcare%20demo.",
  address: "Next57 Coworking, Cabin No. 11, C205 SM Heights, Industrial Area Phase 8B, Mohali, Punjab 140308, India",
  linkedIn: "https://www.linkedin.com/company/solidev-electrosoft-opc-private-limited",
  parentWebsite: "https://www.solidevelectrosoft.com",
} as const;

export const NAV = {
  platform: { label: "Platform", path: "/platform" },
  features: { label: "Features", path: "/features" },
  pricing: { label: "Pricing", path: "/pricing" },
  about: { label: "About", path: "/about" },
  contact: { label: "Contact", path: "/contact" },
  security: { label: "Security", path: "/security" },
  careers: { label: "Careers", path: "/careers" },
  solutions: [
    { label: "For Clinics", path: "/solutions/clinics" },
    { label: "For Hospitals", path: "/solutions/hospitals" },
    { label: "For Healthcare Chains", path: "/solutions/chains" },
  ],
} as const;
