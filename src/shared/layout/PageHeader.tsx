import React from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        mb: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "flex-start" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: title ? 1 : 0 }}
          >
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              if (isLast || !item.to) {
                return (
                  <Typography key={item.label} variant="body2" color="text.primary" fontWeight={500}>
                    {item.label}
                  </Typography>
                );
              }
              return (
                <Link
                  key={item.label}
                  component={RouterLink}
                  to={item.to}
                  underline="hover"
                  color="text.secondary"
                  variant="body2"
                >
                  {item.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}

        {title && (
          <Typography component="h1" variant="h5" fontWeight={700} sx={{ lineHeight: 1.3 }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {actions && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}
