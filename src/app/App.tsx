import React from "react";
import { ThemeProvider } from "./providers/ThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
import { Router } from "./Router";

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router />
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
