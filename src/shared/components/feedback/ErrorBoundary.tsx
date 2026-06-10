import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10} gap={2}>
          <WarningAmberOutlinedIcon sx={{ fontSize: 56, color: "warning.main" }} />
          <Typography variant="h6" fontWeight={600}>Something went wrong</Typography>
          <Typography variant="body2" color="text.secondary">{this.state.error?.message}</Typography>
          <Button variant="contained" onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
