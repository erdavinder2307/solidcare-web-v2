import React from "react";
import { Chip, type ChipProps } from "@mui/material";

export type StatusTone = "success" | "warning" | "error" | "info" | "neutral" | "clinical";

const toneColors: Record<StatusTone, ChipProps["color"]> = {
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
  neutral: "default",
  clinical: "secondary",
};

export interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  size?: ChipProps["size"];
  variant?: ChipProps["variant"];
}

/** Semantic status pill — use instead of raw MUI Chip for domain statuses. */
export function StatusBadge({
  label,
  tone = "neutral",
  size = "small",
  variant = "outlined",
}: StatusBadgeProps) {
  return (
    <Chip
      label={label}
      size={size}
      variant={variant}
      color={toneColors[tone]}
      sx={{ fontWeight: 500, textTransform: "capitalize" }}
    />
  );
}

const appointmentStatusTone: Record<string, StatusTone> = {
  scheduled: "info",
  confirmed: "info",
  checked_in: "warning",
  in_consultation: "clinical",
  completed: "success",
  cancelled: "neutral",
  no_show: "error",
};

export function AppointmentStatusBadge({ status }: { status: string }) {
  return (
    <StatusBadge
      label={status.replace(/_/g, " ")}
      tone={appointmentStatusTone[status] ?? "neutral"}
    />
  );
}

const entityStatusTone: Record<string, StatusTone> = {
  active: "success",
  inactive: "neutral",
  suspended: "warning",
  draft: "neutral",
  finalized: "success",
  dispensed: "success",
  cancelled: "error",
  in_progress: "clinical",
  partially_paid: "info",
  issued: "warning",
  paid: "success",
  unpaid: "warning",
  partial: "info",
  refunded: "neutral",
};

export function EntityStatusBadge({ status }: { status: string }) {
  return (
    <StatusBadge
      label={status.replace(/_/g, " ")}
      tone={entityStatusTone[status.toLowerCase()] ?? "neutral"}
    />
  );
}
