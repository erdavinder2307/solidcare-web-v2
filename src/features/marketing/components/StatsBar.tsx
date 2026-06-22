import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";

const STATS = [
    {
        icon: ViewModuleOutlinedIcon,
        value: "12",
        label: "Integrated clinical modules",
    },
    {
        icon: RouteOutlinedIcon,
        value: "End-to-end",
        label: "OPD workflow — registration to billing",
    },
    {
        icon: LocationOnOutlinedIcon,
        value: "India",
        label: "Data residency — Azure India regions",
    },
    {
        icon: HubOutlinedIcon,
        value: "ABDM-ready",
        label: "Architected for India's digital health ecosystem",
    },
] as const;

export function StatsBar() {
    return (
        <Box
            sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
            }}
        >
            <Grid container>
                {STATS.map(({ icon: Icon, value, label }, i) => (
                    <Grid key={label} size={{ xs: 6, md: 3 }}>
                        <Box
                            sx={{
                                p: { xs: 2.5, md: 3 },
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.5,
                                height: "100%",
                                borderRight: { xs: i % 2 === 0 ? "1px solid" : "none", md: i < 3 ? "1px solid" : "none" },
                                borderBottom: { xs: i < 2 ? "1px solid" : "none", md: "none" },
                                borderColor: "divider",
                            }}
                        >
                            <Icon sx={{ color: "primary.main", mt: 0.25, flexShrink: 0 }} />
                            <Box>
                                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.25 }}>
                                    {value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: "block" }}>
                                    {label}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
