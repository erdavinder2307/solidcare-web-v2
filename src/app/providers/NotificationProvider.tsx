import React from "react";
import { SnackbarProvider } from "notistack";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={4000}
    >
      {children}
    </SnackbarProvider>
  );
}
