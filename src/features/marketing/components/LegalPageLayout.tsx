import React from "react";
import { Box, Typography } from "@mui/material";
import { PageMeta } from "./PageMeta";
import { MarketingHero } from "./MarketingHero";
import { SectionContainer } from "./SectionContainer";
import { LegalReviewBanner } from "./LegalReviewBanner";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  path: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  description,
  path,
  lastUpdated = "June 2026",
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <PageMeta title={title} description={description} path={path} />
      <MarketingHero title={title} subtitle={`Last updated: ${lastUpdated}`} compact />
      <SectionContainer py={6}>
        <LegalReviewBanner />
        <Box
          sx={{
            maxWidth: 800,
            mx: "auto",
            "& h2": { typography: "h5", fontWeight: 700, mt: 4, mb: 1.5 },
            "& h3": { typography: "h6", fontWeight: 600, mt: 3, mb: 1 },
            "& p, & li": { typography: "body2", color: "text.secondary", mb: 1.5 },
            "& ul": { pl: 3, mb: 2 },
          }}
        >
          {children}
        </Box>
      </SectionContainer>
    </>
  );
}
