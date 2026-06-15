import React from "react";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/features/organizations/api/organizationsApi";
import { useClinicStore } from "@/app/store/clinicStore";
import { useClinicBootstrap } from "@/shared/hooks/useClinicBootstrap";

export function WorkspaceSwitcher() {
  const { isLoading: clinicsLoading } = useClinicBootstrap();
  const { activeClinicId, activeClinic, clinics, setActiveClinic } = useClinicStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { data: org, isLoading: orgLoading } = useQuery({
    queryKey: ["organization-current"],
    queryFn: () => organizationsApi.current(),
    staleTime: 10 * 60_000,
  });

  const open = Boolean(anchorEl);

  if (orgLoading || clinicsLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
        <Skeleton variant="rounded" width={160} height={32} />
      </Box>
    );
  }

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        aria-label="Switch clinic"
        sx={{
          color: "text.primary",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.8125rem",
          px: 1.5,
          py: 0.75,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          maxWidth: 280,
          "&:hover": { bgcolor: "grey.50", borderColor: "grey.300" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, textAlign: "left" }}>
          <BusinessOutlinedIcon sx={{ fontSize: 18, color: "text.secondary", flexShrink: 0 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2} noWrap>
              {org?.name ?? "Organization"}
            </Typography>
            <Typography variant="body2" fontWeight={600} noWrap>
              {activeClinic?.name ?? "Select clinic"}
            </Typography>
          </Box>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        PaperProps={{ sx: { minWidth: 280, mt: 0.5 } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
            Organization
          </Typography>
          <Typography variant="body2" fontWeight={600}>{org?.name ?? "—"}</Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
            Clinics
          </Typography>
        </Box>
        {clinics.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No clinics available" />
          </MenuItem>
        ) : (
          clinics.map((clinic) => {
            const selected = clinic.id === activeClinicId;
            return (
              <MenuItem
                key={clinic.id}
                selected={selected}
                onClick={() => {
                  setActiveClinic(clinic);
                  setAnchorEl(null);
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {selected ? (
                    <CheckIcon fontSize="small" color="primary" />
                  ) : (
                    <LocalHospitalOutlinedIcon fontSize="small" color="action" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={clinic.name}
                  secondary={[clinic.code, clinic.city].filter(Boolean).join(" · ")}
                  primaryTypographyProps={{ fontWeight: selected ? 600 : 400 }}
                />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}
