import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/app/store/authStore";
import { useUIStore } from "@/app/store/uiStore";
import type { DensityMode } from "@/lib/theme/tokens";
import { PageHeader, PageLayout } from "@/shared/layout";
import { FormSection } from "@/shared/ui";
import { useState } from "react";

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthStore((s) => s.user);
  const { density, setDensity } = useUIStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaSetup, setMfaSetup] = useState<{ qr_code_base64?: string; secret?: string } | null>(null);

  const changePasswordMutation = useMutation({
    mutationFn: () => authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      enqueueSnackbar("Password changed", { variant: "success" });
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: () => enqueueSnackbar("Failed to change password", { variant: "error" }),
  });

  const setupMfaMutation = useMutation({
    mutationFn: () => authApi.setupMfa(),
    onSuccess: (data) => setMfaSetup(data),
  });

  const confirmMfaMutation = useMutation({
    mutationFn: () => authApi.confirmMfa(mfaCode),
    onSuccess: () => {
      enqueueSnackbar("MFA enabled", { variant: "success" });
      setMfaSetup(null);
      setMfaCode("");
    },
  });

  return (
    <PageLayout maxWidth={800}>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, security, and preferences"
        breadcrumbs={[{ label: "Settings" }]}
      />

      <FormSection title="Profile" description="Your account details and workspace context.">
        <Typography variant="body2" color="text.secondary">Email: {user?.email}</Typography>
        <Typography variant="body2" color="text.secondary">Roles: {user?.roles.join(", ")}</Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
          Switch your active clinic from the organization menu in the top bar.
        </Typography>
      </FormSection>

      <FormSection title="Display density" description="Compact mode fits more rows on clinical and billing screens.">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={density}
          onChange={(_, value: DensityMode | null) => value && setDensity(value)}
        >
          <ToggleButton value="comfortable">Comfortable</ToggleButton>
          <ToggleButton value="compact">Compact</ToggleButton>
        </ToggleButtonGroup>
      </FormSection>

      <FormSection title="Change password">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Current password" type="password" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="New password" type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} />
          </Grid>
          <Grid size={12}>
            <Button variant="contained" disabled={!currentPassword || !newPassword || changePasswordMutation.isPending}
              onClick={() => changePasswordMutation.mutate()}>
              Update password
            </Button>
          </Grid>
        </Grid>
      </FormSection>

      <FormSection title="Two-factor authentication">
        {!mfaSetup ? (
          <Button variant="outlined" onClick={() => setupMfaMutation.mutate()} disabled={setupMfaMutation.isPending}>
            Set up MFA
          </Button>
        ) : (
          <Box>
            {mfaSetup.qr_code_base64 && (
              <Box component="img" src={`data:image/png;base64,${mfaSetup.qr_code_base64}`} alt="MFA QR" sx={{ mb: 2, maxWidth: 200 }} />
            )}
            <TextField fullWidth label="Verification code" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" disabled={!mfaCode} onClick={() => confirmMfaMutation.mutate()}>
              Confirm MFA
            </Button>
          </Box>
        )}
      </FormSection>
    </PageLayout>
  );
}
