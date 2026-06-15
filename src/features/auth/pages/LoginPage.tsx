import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useAuthStore } from "@/app/store/authStore";
import { authApi } from "../api/authApi";
import { DevQuickLogin } from "../components/DevQuickLogin";
import { PageMeta } from "@/features/marketing/components/PageMeta";

interface LoginLocationState {
  from?: { pathname: string };
}

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokens } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const from = (location.state as LoginLocationState)?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.requires_mfa) {
        navigate("/mfa", { state: { mfa_token: data.mfa_token } });
        return;
      }
      setTokens(data.access_token, data.refresh_token);
      navigate(from, { replace: true });
    },
  });

  const onSubmit = (values: FormData) => loginMutation.mutate(values);

  return (
    <>
      <PageMeta title="Login" description="Sign in to Solidcare" path="/login" noIndex />
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        background: "linear-gradient(135deg, #E3F2FD 0%, #F5F7FA 50%, #E8F5E9 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{ p: 5, width: "100%", maxWidth: 440, borderRadius: 3, border: "1px solid", borderColor: "divider" }}
      >
        {/* Brand */}
        <Link component={RouterLink} to="/" underline="none" color="inherit" sx={{ display: "block", mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ← Back to website
          </Typography>
        </Link>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="white">S</Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="primary.main">Solidcare</Typography>
            <Typography variant="caption" color="text.secondary">Healthcare Platform</Typography>
          </Box>
        </Box>

        <Typography variant="h5" fontWeight={700} mb={0.5}>Welcome back</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to your account to continue
        </Typography>

        {loginMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(loginMutation.error as any)?.response?.data?.detail || "Invalid credentials. Please try again."}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            autoComplete="email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loginMutation.isPending}
            sx={{ py: 1.25 }}
          >
            {loginMutation.isPending ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
          </Button>
        </form>

        <DevQuickLogin
          loginMutation={loginMutation}
          onAutofill={(email, password) => {
            setValue("email", email, { shouldValidate: true });
            setValue("password", password, { shouldValidate: true });
          }}
        />

        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={3}>
          © {new Date().getFullYear()} Solidev Electrosoft. All rights reserved.
        </Typography>
      </Paper>
    </Box>
    </>
  );
}
