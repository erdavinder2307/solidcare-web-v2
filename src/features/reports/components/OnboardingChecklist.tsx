import { useState } from "react";
import { Box, Button, IconButton, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CloseIcon from "@mui/icons-material/Close";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { appointmentsApi } from "@/features/appointments/api/appointmentsApi";
import { prescriptionsApi } from "@/features/prescriptions/api/prescriptionsApi";
import { billingApi } from "@/features/billing/api/billingApi";
import { Surface } from "@/shared/ui";
import {
  allTotalsKnown,
  buildOnboardingSteps,
  readDismissed,
  writeDismissed,
  type OnboardingTotals,
} from "./onboardingSteps";

interface Props {
  clinicId: string;
}

const totalOf = (page: { total?: number } | undefined) =>
  typeof page?.total === "number" ? page.total : undefined;

/** Getting-started list for a new clinic. Each step is ticked from real records (one-row list calls). */
export default function OnboardingChecklist({ clinicId }: Props) {
  const [dismissed, setDismissed] = useState(() => readDismissed(clinicId));

  const [patients, appointments, prescriptions, invoices] = useQueries({
    queries: [
      { queryKey: ["onboarding", "patients", clinicId], queryFn: () => patientsApi.list({ page: 1, page_size: 1 }) },
      {
        queryKey: ["onboarding", "appointments", clinicId],
        queryFn: () => appointmentsApi.list({ page: 1, page_size: 1, clinic_id: clinicId }),
      },
      {
        queryKey: ["onboarding", "prescriptions", clinicId],
        queryFn: () => prescriptionsApi.list({ page: 1, page_size: 1 }),
      },
      { queryKey: ["onboarding", "invoices", clinicId], queryFn: () => billingApi.listInvoices({ page: 1, page_size: 1 }) },
    ].map((q) => ({ ...q, enabled: !dismissed, staleTime: 60_000, retry: false })),
  });

  const totals: OnboardingTotals = {
    patient: totalOf(patients.data),
    appointment: totalOf(appointments.data),
    prescription: totalOf(prescriptions.data),
    invoice: totalOf(invoices.data),
  };

  if (dismissed || !allTotalsKnown(totals)) return null;

  const steps = buildOnboardingSteps(totals);
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  const dismiss = () => {
    writeDismissed(clinicId);
    setDismissed(true);
  };

  return (
    <Surface sx={{ p: 2 }} data-testid="onboarding-checklist">
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Get your clinic started
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {doneCount} of {steps.length} done
          </Typography>
        </Box>
        <Tooltip title="Hide this checklist">
          <IconButton size="small" aria-label="Hide checklist" onClick={dismiss}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(doneCount / steps.length) * 100}
        sx={{ my: 1.5, borderRadius: 1 }}
      />
      <Stack spacing={1}>
        {steps.map((step) => (
          <Box key={step.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {step.done ? (
              <CheckCircleIcon color="success" fontSize="small" aria-label="Done" />
            ) : (
              <RadioButtonUncheckedIcon color="disabled" fontSize="small" aria-label="Not done" />
            )}
            <Typography
              variant="body2"
              sx={{ flex: 1, color: step.done ? "text.secondary" : "text.primary" }}
            >
              {step.label}
            </Typography>
            {!step.done && (
              <Button component={RouterLink} to={step.to} size="small" variant="text">
                {step.actionLabel}
              </Button>
            )}
          </Box>
        ))}
      </Stack>
    </Surface>
  );
}
