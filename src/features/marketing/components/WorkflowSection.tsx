import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
import QueueOutlinedIcon from "@mui/icons-material/QueueOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const STEPS = [
    {
        icon: AppRegistrationOutlinedIcon,
        number: "01",
        title: "Register patient",
        description:
            "Front desk creates a UHID-linked patient record with demographics, medical history, and insurance details.",
        bullets: ["Walk-in and scheduled intake", "Searchable patient registry", "Document upload and management"],
    },
    {
        icon: QueueOutlinedIcon,
        number: "02",
        title: "Schedule & queue",
        description:
            "Book the appointment, issue a queue token, and manage the real-time waiting room from the reception dashboard.",
        bullets: ["Token-based queue management", "Real-time check-in status", "Nurse vitals capture"],
    },
    {
        icon: MedicalServicesOutlinedIcon,
        number: "03",
        title: "Consult & prescribe",
        description:
            "Doctor reviews patient history, documents the SOAP encounter, codes the diagnosis with ICD-10, and generates the e-prescription.",
        bullets: ["ICD-10 diagnosis coding", "Drug-allergy interaction alerts", "E-prescription PDF generation"],
    },
    {
        icon: ReceiptLongOutlinedIcon,
        number: "04",
        title: "Bill & close",
        description:
            "Billing staff generates a GST-compliant invoice, records the payment mode, and issues the receipt.",
        bullets: ["GST-compliant invoicing", "Multiple payment modes", "Printable receipts and audit trail"],
    },
] as const;

export function WorkflowSection() {
    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography
                    variant="overline"
                    sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 1.2, display: "block", mb: 1 }}
                >
                    How it works
                </Typography>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    The complete OPD patient journey
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                    Every step shares the same patient record — no duplicate data entry, no switching systems between
                    reception, clinical, and billing.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {STEPS.map(({ icon: Icon, number, title, description, bullets }, i) => (
                    <Grid key={number} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Box
                            sx={{
                                p: 3,
                                height: "100%",
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.paper",
                                position: "relative",
                            }}
                        >
                            {/* Step number badge */}
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    mb: 2,
                                }}
                            >
                                <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.75rem" }}>
                                    {number}
                                </Typography>
                            </Box>

                            {/* Icon */}
                            <Icon sx={{ color: "primary.main", display: "block", mb: 1, fontSize: 28 }} />

                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                                {description}
                            </Typography>

                            <Stack spacing={0.5}>
                                {bullets.map((b) => (
                                    <Box key={b} sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
                                        <Box
                                            sx={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: "50%",
                                                bgcolor: "primary.main",
                                                mt: 0.75,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                            {b}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>

                            {/* Connector arrow (hidden on last and on mobile) */}
                            {i < STEPS.length - 1 && (
                                <Box
                                    sx={{
                                        display: { xs: "none", lg: "flex" },
                                        position: "absolute",
                                        top: "50%",
                                        right: -20,
                                        transform: "translateY(-50%)",
                                        color: "primary.main",
                                        opacity: 0.4,
                                        zIndex: 1,
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    →
                                </Box>
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
