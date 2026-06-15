import React from "react";
import { Box, Container, Link, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link as RouterLink } from "react-router-dom";
import { SolidcareLogo } from "../components/SolidcareLogo";
import { COMPANY, NAV, SITE } from "../config/site";

const FOOTER_LINKS = {
  product: [
    { label: "Platform", path: "/platform" },
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "Security", path: "/security" },
  ],
  solutions: NAV.solutions,
  company: [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Careers", path: "/careers" },
  ],
  legal: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Cookie Policy", path: "/cookies" },
    { label: "Disclaimer", path: "/disclaimer" },
  ],
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; path: string }[];
}) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Stack spacing={0.75}>
        {links.map((link) => (
          <Link
            key={link.path}
            component={RouterLink}
            to={link.path}
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            {link.label}
          </Link>
        ))}
      </Stack>
    </Box>
  );
}

export function MarketingFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.900", color: "grey.300", pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ "& a": { color: "inherit" } }}>
              <SolidcareLogo size="sm" />
            </Box>
            <Typography variant="body2" sx={{ mt: 2, mb: 2, maxWidth: 320, color: "grey.400" }}>
              {SITE.description}
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2">{COMPANY.email}</Typography>
              <Typography variant="body2">{COMPANY.phone}</Typography>
              <Typography variant="body2" sx={{ maxWidth: 280 }}>
                {COMPANY.address}
              </Typography>
            </Stack>
            <Link href={COMPANY.linkedIn} target="_blank" rel="noopener noreferrer" color="grey.400" sx={{ display: "inline-flex", mt: 2 }}>
              <LinkedInIcon />
            </Link>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <FooterColumn title="Product" links={FOOTER_LINKS.product} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <FooterColumn title="Solutions" links={FOOTER_LINKS.solutions} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
          </Grid>
        </Grid>

        <Box sx={{ borderTop: "1px solid", borderColor: "grey.800", mt: 6, pt: 3 }}>
          <Typography variant="caption" color="grey.500" display="block">
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </Typography>
          <Typography variant="caption" color="grey.500">
            {COMPANY.productLine}{" "}
            <Link href={COMPANY.parentWebsite} target="_blank" rel="noopener noreferrer" color="grey.400">
              solidevelectrosoft.com
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
