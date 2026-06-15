import React from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import type { StatusTone } from "./StatusBadge";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "@/shared/utils/formatters";

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  timestamp: string;
  link?: string;
  tone?: StatusTone;
  statusLabel?: string;
}

export interface TimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function Timeline({
  events,
  isLoading,
  emptyTitle = "No activity yet",
  emptyDescription = "Clinical and billing events will appear here chronologically.",
}: TimelineProps) {
  if (isLoading) {
    return (
      <Box>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, mb: 2.5 }}>
            <Skeleton variant="circular" width={10} height={10} sx={{ mt: 0.75 }} />
            <Box flex={1}>
              <Skeleton width="40%" height={20} />
              <Skeleton width="60%" height={16} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box py={4} textAlign="center">
        <Typography variant="subtitle2" fontWeight={600}>{emptyTitle}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {emptyDescription}
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
      {events.map((event, index) => {
        const content = (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              pb: index < events.length - 1 ? 2.5 : 0,
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "primary.main",
                mt: 0.75,
                flexShrink: 0,
                boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}22`,
              }}
            />
            {index < events.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  left: 4.5,
                  top: 16,
                  bottom: 0,
                  width: 1,
                  bgcolor: "divider",
                }}
              />
            )}
            <Box flex={1} minWidth={0}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.25}>
                <Typography variant="body2" fontWeight={600}>
                  {event.title}
                </Typography>
                {event.statusLabel && (
                  <StatusBadge label={event.statusLabel} tone={event.tone ?? "neutral"} />
                )}
              </Box>
              {event.subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
                  {event.subtitle}
                </Typography>
              )}
              <Typography variant="caption" color="text.disabled">
                {formatDateTime(event.timestamp)} · {event.type}
              </Typography>
            </Box>
          </Box>
        );

        return (
          <Box component="li" key={event.id}>
            {event.link ? (
              <Box
                component={Link}
                to={event.link}
                sx={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 1,
                  mx: -1,
                  px: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                {content}
              </Box>
            ) : (
              content
            )}
          </Box>
        );
      })}
    </Box>
  );
}
