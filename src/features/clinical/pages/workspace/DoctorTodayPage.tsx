import {
  Alert,
  Box,
  Button,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import { useTodayAppointments } from "@/features/clinical/hooks/useTodayAppointments";
import { QueueTable } from "@/features/clinical/components/QueueTable";
import { Surface } from "@/shared/ui";
import { formatDate } from "@/shared/utils/formatters";

function StatCard({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <Surface sx={{ p: 2, height: "100%" }}>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={700} color={tone ?? "text.primary"} sx={{ mt: 0.5, lineHeight: 1.2 }}>
        {value}
      </Typography>
    </Surface>
  );
}

export default function DoctorTodayPage() {
  const navigate = useNavigate();
  const {
    today,
    appointments,
    queue,
    patientNames,
    inConsultation,
    waitingCount,
    checkedInCount,
    completedCount,
    isLoading,
    isFetching,
    refetch,
  } = useTodayAppointments({ doctorOnly: true });

  const schedule = [...appointments].sort((a, b) =>
    `${a.start_time}`.localeCompare(`${b.start_time}`),
  );

  return (
    <Box>
      {inConsultation && (
        <Alert
          severity="info"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              startIcon={<PlayArrowIcon />}
              onClick={() => navigate(`/consultation/${inConsultation.id}`)}
            >
              Continue
            </Button>
          }
        >
          In consultation with{" "}
          <strong>{patientNames.get(inConsultation.patient_id) ?? "patient"}</strong>
          {inConsultation.token_number ? ` · Token ${inConsultation.token_number}` : ""}
        </Alert>
      )}

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </Button>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Waiting" value={waitingCount} tone="warning.main" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Checked in" value={checkedInCount} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Completed" value={completedCount} tone="success.main" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Total today" value={appointments.length} />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
        Today&apos;s schedule · {formatDate(today)}
      </Typography>

      <Surface sx={{ overflow: "hidden" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box component="thead" sx={{ bgcolor: "grey.50" }}>
              <Box component="tr">
                {["Time", "Token", "Patient", "Status", ""].map((h) => (
                  <Box
                    component="th"
                    key={h}
                    sx={{ textAlign: "left", px: 2, py: 1.25, fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}
                  >
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {schedule.map((appt) => (
                <Box
                  component="tr"
                  key={appt.id}
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    bgcolor: appt.status === "in_consultation" ? "action.selected" : "transparent",
                  }}
                >
                  <Box component="td" sx={{ px: 2, py: 1.25 }}>{appt.start_time}</Box>
                  <Box component="td" sx={{ px: 2, py: 1.25, fontFamily: "monospace", fontWeight: 600 }}>
                    {appt.token_number ?? "—"}
                  </Box>
                  <Box component="td" sx={{ px: 2, py: 1.25 }}>
                    {patientNames.get(appt.patient_id) ?? "—"}
                  </Box>
                  <Box component="td" sx={{ px: 2, py: 1.25, textTransform: "capitalize" }}>
                    {appt.status.replace(/_/g, " ")}
                  </Box>
                  <Box component="td" sx={{ px: 2, py: 1.25, textAlign: "right" }}>
                    {appt.status === "in_consultation" && (
                      <Button size="small" onClick={() => navigate(`/consultation/${appt.id}`)}>
                        Open
                      </Button>
                    )}
                    {appt.status === "checked_in" && (
                      <Button size="small" variant="contained" onClick={() => navigate("/clinical/workspace/waiting-room")}>
                        Start
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
              {!isLoading && schedule.length === 0 && (
                <Box component="tr">
                  <Box component="td" colSpan={5} sx={{ px: 2, py: 6, textAlign: "center", color: "text.secondary" }}>
                    No appointments scheduled for you today
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Surface>

      {queue.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
            Active queue
          </Typography>
          <QueueTable
            queue={queue.slice(0, 5)}
            patientNames={patientNames}
            isLoading={isLoading}
            canUpdate={false}
            emptyTitle="No active patients"
          />
        </Box>
      )}
    </Box>
  );
}
