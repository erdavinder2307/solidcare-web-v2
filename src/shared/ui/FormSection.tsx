import React from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { densityTokens } from "@/lib/theme/tokens";
import { Surface } from "./Surface";

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Render without outer Surface wrapper (when nested inside a form Paper). */
  bare?: boolean;
}

export function FormSection({ title, description, children, bare = false }: FormSectionProps) {
  const theme = useTheme();
  const density = densityTokens[theme.solidcare.density];
  const cardPadding = `${density.cardPadding}px`;
  const sectionGap = `${density.sectionGap}px`;

  const content = (
    <>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </>
  );

  if (bare) {
    return (
      <Box sx={{ mb: sectionGap }}>
        {content}
        <Divider sx={{ mt: sectionGap }} />
      </Box>
    );
  }

  return (
    <Surface sx={{ p: cardPadding, mb: sectionGap }}>
      {content}
    </Surface>
  );
}
