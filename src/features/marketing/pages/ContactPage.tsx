import React from "react";
import Grid from "@mui/material/Grid2";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { COMPANY } from "../config/site";

export default function ContactPage() {
  return (
    <>
      <PageMeta
        title="Contact Us"
        description="Contact Solidcare — request a demo, ask about deployment, or speak with our team in Mohali, India."
        path="/contact"
      />
      <MarketingHero
        eyebrow="Contact"
        title="Let's discuss your healthcare operations"
        subtitle="Reach out to schedule a demo, ask about features, or explore how Solidcare fits your clinic or hospital."
        compact
      />
      <SectionContainer py={6}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <WhatsAppIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Request a demo (WhatsApp)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Fastest way to connect — message us to schedule a walkthrough.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    href={COMPANY.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <EmailOutlinedIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Email
                  </Typography>
                  <Link href={`mailto:${COMPANY.email}`} underline="hover">
                    {COMPANY.email}
                  </Link>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <PhoneOutlinedIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Phone / WhatsApp
                  </Typography>
                  <Typography variant="body2">{COMPANY.phone}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <LocationOnOutlinedIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Office
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {COMPANY.address}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom>
                What to expect
              </Typography>
              <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
                <li>A guided demo of patient, clinical, and billing workflows</li>
                <li>Discussion of your clinic or hospital requirements</li>
                <li>Overview of security, RBAC, and deployment options</li>
                <li>No obligation — we respond within one business day</li>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </SectionContainer>
    </>
  );
}
