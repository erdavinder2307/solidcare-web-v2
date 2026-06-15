import React from "react";
import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export interface ContextNavItem {
  label: string;
  to: string;
  end?: boolean;
}

export interface ContextNavProps {
  items: ContextNavItem[];
  ariaLabel?: string;
}

function isContextItemActive(pathname: string, item: ContextNavItem) {
  if (item.end) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export function ContextNav({ items, ariaLabel = "Section navigation" }: ContextNavProps) {
  const location = useLocation();

  return (
    <Box
      component="nav"
      aria-label={ariaLabel}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        mb: 3,
        mx: { xs: -2, sm: 0 },
        px: { xs: 2, sm: 0 },
        display: "flex",
        gap: 0.5,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {items.map((item) => {
        const active = isContextItemActive(location.pathname, item);
        return (
          <Box
            key={item.to}
            component={Link}
            to={item.to}
            aria-current={active ? "page" : undefined}
            sx={{
              flexShrink: 0,
              px: 2,
              py: 1.25,
              textDecoration: "none",
              borderBottom: 2,
              borderColor: active ? "primary.main" : "transparent",
              color: active ? "primary.main" : "text.secondary",
              mb: "-1px",
              transition: "color 0.15s, border-color 0.15s",
              "&:hover": {
                color: active ? "primary.main" : "text.primary",
              },
            }}
          >
            <Typography variant="body2" fontWeight={active ? 600 : 500}>
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
