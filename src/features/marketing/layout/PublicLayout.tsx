import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { MarketingHeader } from "./MarketingHeader";
import { MarketingFooter } from "./MarketingFooter";

export function PublicLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <MarketingHeader />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <MarketingFooter />
    </Box>
  );
}
