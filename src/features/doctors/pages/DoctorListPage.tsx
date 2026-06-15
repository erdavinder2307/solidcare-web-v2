import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { doctorsApi } from "../api/doctorsApi";
import { useAuthStore } from "@/app/store/authStore";
import { formatCurrency } from "@/shared/utils/formatters";
import { PageHeader, PageLayout } from "@/shared/layout";
import { EmptyState, EntityStatusBadge, Surface } from "@/shared/ui";

export default function DoctorListPage() {
  const navigate = useNavigate();
  const can = useAuthStore((s) => s.can);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => doctorsApi.list(),
  });

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Doctors"
        subtitle={`${doctors.length} doctors registered`}
        breadcrumbs={[
          { label: "Administration" },
          { label: "Doctors" },
        ]}
        actions={
          can("doctor:create") ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/doctors/new")}>
              Add Doctor
            </Button>
          ) : undefined
        }
      />

      <TableContainer component={Surface} sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specializations</TableCell>
              <TableCell>Registration #</TableCell>
              <TableCell>Consultation Fee</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((d) => (
              <TableRow key={d.id} hover sx={{ cursor: "pointer" }} onClick={() => navigate(`/doctors/${d.id}`)}>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    Dr. {d.first_name && d.last_name ? `${d.first_name} ${d.last_name}` : d.user_id.slice(0, 8)}
                  </Typography>
                </TableCell>
                <TableCell>{d.email ?? "—"}</TableCell>
                <TableCell>
                  {(d.specializations || []).length > 0
                    ? (d.specializations || []).join(", ")
                    : "—"}
                </TableCell>
                <TableCell>{d.registration_number ?? "—"}</TableCell>
                <TableCell>{d.consultation_fee ? formatCurrency(d.consultation_fee) : "—"}</TableCell>
                <TableCell>
                  <EntityStatusBadge status={d.status} />
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && doctors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                  <EmptyState
                    icon={<PersonAddOutlinedIcon sx={{ fontSize: 48 }} />}
                    title="No doctors registered"
                    description="Add your first doctor to enable appointments and clinical workflows."
                    action={
                      can("doctor:create") ? (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/doctors/new")}>
                          Add Doctor
                        </Button>
                      ) : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
}
