import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ElementType;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
  columns?: 2 | 3;
}

export function FeatureGrid({ title, subtitle, items, columns = 3 }: FeatureGridProps) {
  const colSize = columns === 2 ? { xs: 12, md: 6 } : { xs: 12, sm: 6, md: 4 };

  return (
    <Box>
      {title && (
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 720 }}>
          {subtitle}
        </Typography>
      )}
      <Grid container spacing={3}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Grid key={item.title} size={colSize}>
              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {Icon && <Icon sx={{ color: "primary.main", mb: 1.5, fontSize: 28 }} />}
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
