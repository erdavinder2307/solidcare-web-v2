import React from "react";
import { Box, Container, Typography } from "@mui/material";

interface MarketingHeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  compact?: boolean;
}

export function MarketingHero({ eyebrow, title, subtitle, children, compact }: MarketingHeroProps) {
  return (
    <Box
      sx={{
        bgcolor: "grey.50",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: compact ? { xs: 6, md: 8 } : { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 1.2, display: "block", mb: 1 }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h2"
          component="h1"
          fontWeight={700}
          sx={{ fontSize: { xs: "2rem", md: "2.75rem" }, maxWidth: 800, mb: 2 }}
        >
          {title}
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 720, mb: children ? 4 : 0 }}>
          {subtitle}
        </Typography>
        {children}
      </Container>
    </Box>
  );
}
