import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/app/store/uiStore";
import { patientsApi, type PatientListItem } from "@/features/patients/api/patientsApi";

interface QuickAction {
  label: string;
  path: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Go to Dashboard", path: "/dashboard", description: "Overview and key metrics" },
  { label: "Open Waiting Room", path: "/appointments/queue", description: "Manage checked-in patients" },
  { label: "Book Appointment", path: "/appointments/new", description: "Create a new appointment" },
  { label: "Register Patient", path: "/patients/new", description: "Add a new patient profile" },
  { label: "View Reports", path: "/reports", description: "Operational and financial analytics" },
  { label: "Appointment Calendar", path: "/appointments/calendar", description: "Weekly scheduling view" },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const open = useUIStore((s) => s.commandPaletteOpen);
  const close = useUIStore((s) => s.closeCommandPalette);
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();

  const { data: patientPage } = useQuery({
    queryKey: ["command-palette-patients", normalized],
    queryFn: () => patientsApi.list({ page: 1, page_size: 8, search: normalized }),
    enabled: open && normalized.length >= 2,
    staleTime: 30_000,
  });

  const patients = ((patientPage?.items ?? []) as PatientListItem[]).slice(0, 8);

  const actions = useMemo(() => {
    if (!normalized) return QUICK_ACTIONS;
    return QUICK_ACTIONS.filter(
      (a) =>
        a.label.toLowerCase().includes(normalized) ||
        a.description.toLowerCase().includes(normalized),
    );
  }, [normalized]);

  const onNavigate = (path: string) => {
    close();
    setQuery("");
    navigate(path);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          mt: 8,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box px={2} py={1.5} display="flex" alignItems="center" gap={1}>
          <SearchOutlinedIcon color="action" fontSize="small" />
          <TextField
            fullWidth
            autoFocus
            variant="standard"
            placeholder="Search patients or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
          <Chip size="small" label="Cmd+K" />
        </Box>
        <Divider />

        <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
          <Box px={2} py={1}>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
              QUICK ACTIONS
            </Typography>
          </Box>
          <List disablePadding>
            {actions.map((action) => (
              <ListItemButton key={action.path} onClick={() => onNavigate(action.path)}>
                <RocketLaunchOutlinedIcon fontSize="small" style={{ marginRight: 12 }} />
                <ListItemText primary={action.label} secondary={action.description} />
              </ListItemButton>
            ))}
            {actions.length === 0 && (
              <Box px={2} py={1.5}>
                <Typography variant="body2" color="text.secondary">No matching actions</Typography>
              </Box>
            )}
          </List>

          <Divider sx={{ mt: 1 }} />
          <Box px={2} py={1}>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
              PATIENTS
            </Typography>
          </Box>
          <List disablePadding>
            {patients.map((patient) => (
              <ListItemButton
                key={patient.id}
                onClick={() => onNavigate(`/patients/${patient.id}/overview`)}
              >
                <PersonOutlineOutlinedIcon fontSize="small" style={{ marginRight: 12 }} />
                <ListItemText
                  primary={patient.full_name}
                  secondary={`${patient.uhid} · ${patient.phone}`}
                />
              </ListItemButton>
            ))}
            {normalized.length < 2 ? (
              <Box px={2} py={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Type at least 2 characters to search patients
                </Typography>
              </Box>
            ) : patients.length === 0 ? (
              <Box px={2} py={1.5}>
                <Typography variant="body2" color="text.secondary">No matching patients</Typography>
              </Box>
            ) : null}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
