import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { formatElapsed } from "../hooks/useDatabaseWait";

export const DATABASE_WAIT_TEXT = {
  title: "Getting things ready…",
  body: "This can take a minute or two. You'll be signed in automatically.",
  timedOut: "This is taking longer than usual. Please try again in a moment.",
  tryAgain: "Try again",
} as const;

interface DatabaseWaitCardProps {
  elapsedMs: number;
  timedOut: boolean;
  onTryAgain: () => void;
}

export function DatabaseWaitCard({ elapsedMs, timedOut, onTryAgain }: DatabaseWaitCardProps) {
  if (timedOut) {
    return (
      <Box role="alert" sx={{ textAlign: "center", py: 1 }}>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {DATABASE_WAIT_TEXT.timedOut}
        </Typography>
        <Button fullWidth variant="contained" size="large" onClick={onTryAgain} sx={{ py: 1.25 }}>
          {DATABASE_WAIT_TEXT.tryAgain}
        </Button>
      </Box>
    );
  }

  return (
    <Box role="status" aria-live="polite" sx={{ textAlign: "center", py: 1 }}>
      <CircularProgress size={28} sx={{ mb: 1.5 }} />
      <Typography variant="subtitle1" fontWeight={600}>
        {DATABASE_WAIT_TEXT.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        {DATABASE_WAIT_TEXT.body}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mt={1} aria-label="Time waited">
        {formatElapsed(elapsedMs)}
      </Typography>
    </Box>
  );
}
