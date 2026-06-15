import React from "react";
import { Box, Container } from "@mui/material";

interface SectionContainerProps {
  children: React.ReactNode;
  bgcolor?: string;
  py?: number;
}

export function SectionContainer({ children, bgcolor = "background.default", py = 8 }: SectionContainerProps) {
  return (
    <Box sx={{ bgcolor, py: { xs: py - 2, md: py } }}>
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}
