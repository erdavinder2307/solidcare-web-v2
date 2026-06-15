import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import type { UseMutationResult } from "@tanstack/react-query";
import { DEV_LOGIN_PASSWORD, DEV_LOGIN_USERS } from "../config/devLoginUsers";
interface DevQuickLoginProps {
  loginMutation: UseMutationResult<
    Awaited<ReturnType<typeof import("../api/authApi").authApi.login>>,
    Error,
    { email: string; password: string }
  >;
  onAutofill: (email: string, password: string) => void;
}

const ROLE_CHIP_COLOR: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "info" | "error"> = {
  superadmin: "error",
  admin: "primary",
  doctor: "success",
  receptionist: "info",
  billing_clerk: "warning",
};

export function DevQuickLogin({ loginMutation, onAutofill }: DevQuickLoginProps) {
  if (!import.meta.env.DEV) {
    return null;
  }

  const handleQuickLogin = (email: string, password: string) => {
    onAutofill(email, password);
    loginMutation.mutate({ email, password });
  };

  return (
    <Box mt={3}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
        Dev quick login · password: {DEV_LOGIN_PASSWORD}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {DEV_LOGIN_USERS.map((user) => (
          <Chip
            key={user.email}
            label={user.label}
            size="small"
            color={ROLE_CHIP_COLOR[user.role] ?? "default"}
            variant="outlined"
            clickable
            disabled={loginMutation.isPending}
            onClick={() => handleQuickLogin(user.email, user.password)}
          />
        ))}
      </Stack>
    </Box>
  );
}
