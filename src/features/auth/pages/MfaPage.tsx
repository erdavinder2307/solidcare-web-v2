import React from "react";
import { Box, Button, Paper, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/app/store/authStore";
import { authApi } from "../api/authApi";

export default function MfaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokens } = useAuthStore();
  const mfaToken = (location.state as any)?.mfa_token;

  const { register, handleSubmit } = useForm<{ totp_code: string }>();

  const verifyMutation = useMutation({
    mutationFn: ({ totp_code }: { totp_code: string }) =>
      authApi.verifyMfa(mfaToken, totp_code),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      navigate("/dashboard");
    },
  });

  if (!mfaToken) {
    navigate("/login");
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper elevation={0} sx={{ p: 5, width: "100%", maxWidth: 400, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h5" fontWeight={700} mb={0.5}>Two-factor verification</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter the 6-digit code from your authenticator app.
        </Typography>

        {verifyMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>Invalid code. Please try again.</Alert>
        )}

        <form onSubmit={handleSubmit((v) => verifyMutation.mutate(v))}>
          <TextField
            fullWidth
            label="Authentication code"
            inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
            autoFocus
            {...register("totp_code")}
            sx={{ mb: 3 }}
          />
          <Button fullWidth type="submit" variant="contained" size="large" disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? <CircularProgress size={22} color="inherit" /> : "Verify"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
