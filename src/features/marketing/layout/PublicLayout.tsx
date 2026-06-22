import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { MarketingHeader } from "./MarketingHeader";
import { MarketingFooter } from "./MarketingFooter";
import { MobileCTABar } from "../components/MobileCTABar";

export function PublicLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <MarketingHeader />
      {/* pb ensures content isn't hidden behind the mobile sticky CTA bar */}
      <Box component="main" sx={{ flex: 1, pb: { xs: "64px", md: 0 } }}>
        <Outlet />
      </Box>
      <MarketingFooter />
      <MobileCTABar />
    </Box>
  );
}
