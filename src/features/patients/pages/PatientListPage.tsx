import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "../api/patientsApi";
import { useAuthStore } from "@/app/store/authStore";
import { PageHeader, PageLayout } from "@/shared/layout";
import { EmptyState, EntityStatusBadge, Surface } from "@/shared/ui";

export default function PatientListPage() {
  const navigate = useNavigate();
  const can = useAuthStore((s) => s.can);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data, isLoading } = useQuery({
    queryKey: ["patients", { page: page + 1, page_size: rowsPerPage, search }],
    queryFn: () => patientsApi.list({ page: page + 1, page_size: rowsPerPage, search: search || undefined }),
  });

  const patients = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Patients"
        subtitle={`${total.toLocaleString()} total patients registered`}
        actions={
          can("patient:create") ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/patients/new")}
            >
              Register Patient
            </Button>
          ) : undefined
        }
      />

      {/* Search */}
      <Surface sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder="Search by name, phone, or UHID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small"
          fullWidth
          sx={{ maxWidth: { xs: "100%", sm: 360 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Surface>

      <TableContainer component={Surface} sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>UHID</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>City</TableCell>
              <TableCell>ABHA</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}><Box sx={{ height: 20, bgcolor: "grey.100", borderRadius: 1, width: "80%" }} /></TableCell>
                    ))}
                  </TableRow>
                ))
              : patients.map((patient: any) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light", fontSize: "0.75rem" }}>
                          {patient.full_name?.[0] ?? "P"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{patient.full_name}</Typography>
                          <Typography variant="caption" color="text.secondary">{patient.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" fontWeight={500} color="primary.main">
                        {patient.uhid}
                      </Typography>
                    </TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>{patient.gender ?? "—"}</TableCell>
                    <TableCell>
                      {patient.blood_group ? (
                        <Chip label={patient.blood_group} size="small" color="error" variant="outlined" />
                      ) : "—"}
                    </TableCell>
                    <TableCell>{patient.city ?? "—"}</TableCell>
                    <TableCell>
                      {patient.abha_number ? (
                        <Chip label="Linked" size="small" color="success" variant="outlined" />
                      ) : (
                        <Chip label="Not linked" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <EntityStatusBadge status={patient.is_active ? "active" : "inactive"} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View patient">
                        <IconButton
                          size="small"
                          aria-label={`View ${patient.full_name}`}
                          onClick={() => navigate(`/patients/${patient.id}`)}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} sx={{ p: 0, border: 0 }}>
                  <EmptyState
                    title="No patients found"
                    description={search ? "Try a different search term or clear the filter." : "Register your first patient to get started."}
                    action={
                      can("patient:create") && !search ? (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/patients/new")}>
                          Register Patient
                        </Button>
                      ) : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </TableContainer>
    </PageLayout>
  );
}
