import React from "react";
import { Box, Divider, Typography, alpha } from "@mui/material";
import { Surface } from "./Surface";

export interface StatStripItem {
  id: string;
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
}

export interface StatStripProps {
  items: StatStripItem[];
  /** Show vertical dividers between stats on sm+ screens. */
  divided?: boolean;
}

/** Compact horizontal KPI strip — higher density than card grid. */
export function StatStrip({ items, divided = true }: StatStripProps) {
  return (
    <Surface sx={{ p: 0, overflow: "hidden" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))`,
          },
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.5,
              minHeight: 64,
              borderRight: divided && index < items.length - 1
                ? { xs: index % 2 === 0 ? "1px solid" : "none", sm: "1px solid" }
                : "none",
              borderColor: "divider",
              borderBottom: {
                xs: index < items.length - (items.length % 2 === 0 ? 2 : 1) ? "1px solid" : "none",
                sm: "none",
              },
            }}
          >
            {item.icon && (
              <Box
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette[item.color ?? "primary"].main, 0.1),
                  color: `${item.color ?? "primary"}.main`,
                  "& .MuiSvgIcon-root": { fontSize: 20 },
                })}
              >
                {item.icon}
              </Box>
            )}
            <Box minWidth={0}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
                display="block"
                lineHeight={1.2}
                noWrap
              >
                {item.label}
              </Typography>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2} noWrap>
                {item.value}
              </Typography>
              {item.hint && (
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  {item.hint}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Surface>
  );
}

export interface MetricBarItem {
  id: string;
  label: string;
  value: string | number;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
}

export interface MetricBarProps {
  title: string;
  items: MetricBarItem[];
}

/** Inline metric row for section headers — queue counts, summary blocks. */
export function MetricBar({ title, items }: MetricBarProps) {
  return (
    <Surface sx={{ p: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          gap: 0,
        }}
      >
        {items.map((item, index) => (
          <Box key={item.id} sx={{ display: "flex", alignItems: "stretch" }}>
            {index > 0 && (
              <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: "none", sm: "block" } }} />
            )}
            <Box sx={{ minWidth: 88, py: 0.5 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                lineHeight={1.1}
                color={item.color ? `${item.color}.main` : "text.primary"}
              >
                {item.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Surface>
  );
}
