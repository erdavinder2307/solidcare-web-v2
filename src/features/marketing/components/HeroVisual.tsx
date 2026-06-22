import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";

const APPOINTMENTS = [
    { token: "T-01", patient: "Ravi Kumar", time: "10:00 AM", status: "checked_in", label: "Checked In" },
    { token: "T-02", patient: "Priya Sharma", time: "10:30 AM", status: "in_consultation", label: "In Consult" },
    { token: "T-03", patient: "Anand Singh", time: "11:00 AM", status: "scheduled", label: "Scheduled" },
    { token: "T-04", patient: "Meera Patel", time: "11:30 AM", status: "scheduled", label: "Scheduled" },
    { token: "T-05", patient: "Suresh Iyer", time: "12:00 PM", status: "scheduled", label: "Scheduled" },
];

const STATUS_STYLE = {
    checked_in: { bg: "#FEF3C7", fg: "#92400E" },
    in_consultation: { bg: "#CCFBF1", fg: "#0F766E" },
    scheduled: { bg: "#EFF6FF", fg: "#1D4ED8" },
} as const;

const NAV_ITEMS = [
    { icon: DashboardOutlinedIcon, label: "Dashboard", active: false },
    { icon: EventNoteOutlinedIcon, label: "Appointments", active: true },
    { icon: PersonOutlineIcon, label: "Patients", active: false },
    { icon: DescriptionOutlinedIcon, label: "Clinical", active: false },
    { icon: ReceiptOutlinedIcon, label: "Billing", active: false },
];

export function HeroVisual() {
    return (
        <Box
            aria-hidden="true"
            sx={{
                width: { lg: 500, xl: 540 },
                borderRadius: 2,
                overflow: "hidden",
                boxShadow:
                    "0 24px 64px rgba(15, 23, 42, 0.20), 0 4px 16px rgba(15, 23, 42, 0.12)",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                transform: "perspective(1200px) rotateY(-3deg) rotateX(1deg)",
                userSelect: "none",
                pointerEvents: "none",
            }}
        >
            {/* Browser chrome */}
            <Box
                sx={{
                    bgcolor: "grey.100",
                    px: 1.5,
                    py: 0.875,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Stack direction="row" spacing={0.625}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#FF5F57" }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#FEBC2E" }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#28C840" }} />
                </Stack>
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: "white",
                        borderRadius: 0.75,
                        px: 1.5,
                        py: 0.375,
                        border: "1px solid",
                        borderColor: "grey.200",
                    }}
                >
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ fontSize: "0.6rem", lineHeight: 1 }}
                    >
                        app.solidcare.org/appointments
                    </Typography>
                </Box>
            </Box>

            {/* App shell */}
            <Box sx={{ display: "flex", minHeight: 300 }}>
                {/* Icon sidebar */}
                <Box
                    sx={{
                        width: 48,
                        bgcolor: "#0F172A",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        pt: 1.5,
                        pb: 1,
                        gap: 0.25,
                    }}
                >
                    {/* Logo mark */}
                    <Box
                        component="img"
                        src="/appIcon.png"
                        alt="Solidcare"
                        sx={{
                            width: 28,
                            height: 28,
                            objectFit: "contain",
                            mb: 1.5,
                            flexShrink: 0,
                        }}
                    />

                    {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
                        <Box
                            key={label}
                            title={label}
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: active ? "rgba(99, 102, 241, 0.18)" : "transparent",
                                color: active ? "#818CF8" : "rgba(255,255,255,0.35)",
                            }}
                        >
                            <Icon sx={{ fontSize: 17 }} />
                        </Box>
                    ))}
                </Box>

                {/* Main panel */}
                <Box sx={{ flex: 1, p: 2, bgcolor: "grey.50" }}>
                    {/* Page header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1.25,
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: "0.8rem" }}>
                            Today's Appointments
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ fontSize: "0.625rem" }}
                        >
                            Mon, 22 Jun 2026
                        </Typography>
                    </Box>

                    {/* Summary chips */}
                    <Stack direction="row" spacing={0.75} sx={{ mb: 1.5 }}>
                        <Chip
                            size="small"
                            label="12 total"
                            sx={{ fontSize: "0.6rem", height: 18, bgcolor: "#E0F2FE", color: "#0369A1", "& .MuiChip-label": { px: 1 } }}
                        />
                        <Chip
                            size="small"
                            label="1 in consult"
                            sx={{ fontSize: "0.6rem", height: 18, bgcolor: "#CCFBF1", color: "#0F766E", "& .MuiChip-label": { px: 1 } }}
                        />
                        <Chip
                            size="small"
                            label="2 waiting"
                            sx={{ fontSize: "0.6rem", height: 18, bgcolor: "#FEF3C7", color: "#92400E", "& .MuiChip-label": { px: 1 } }}
                        />
                    </Stack>

                    {/* Appointment list */}
                    <Box
                        sx={{
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            overflow: "hidden",
                        }}
                    >
                        {APPOINTMENTS.map((appt, i) => {
                            const s = STATUS_STYLE[appt.status as keyof typeof STATUS_STYLE];
                            return (
                                <Box
                                    key={appt.token}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        px: 1.5,
                                        py: 0.75,
                                        gap: 1,
                                        borderBottom: i < APPOINTMENTS.length - 1 ? "1px solid" : "none",
                                        borderColor: "divider",
                                        bgcolor:
                                            appt.status === "in_consultation"
                                                ? "rgba(13, 148, 136, 0.04)"
                                                : "transparent",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: "0.6rem",
                                            fontWeight: 600,
                                            color: "text.disabled",
                                            width: 28,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {appt.token}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            flex: 1,
                                            fontSize: "0.7rem",
                                            fontWeight: appt.status === "in_consultation" ? 600 : 400,
                                        }}
                                    >
                                        {appt.patient}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.disabled"
                                        sx={{ fontSize: "0.6rem", width: 56, textAlign: "right", flexShrink: 0 }}
                                    >
                                        {appt.time}
                                    </Typography>
                                    <Box sx={{ width: 72, textAlign: "right", flexShrink: 0 }}>
                                        <Chip
                                            size="small"
                                            label={appt.label}
                                            sx={{
                                                fontSize: "0.55rem",
                                                height: 18,
                                                bgcolor: s?.bg,
                                                color: s?.fg,
                                                "& .MuiChip-label": { px: 0.75 },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
