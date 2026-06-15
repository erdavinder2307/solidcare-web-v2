import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/app/store/uiStore";
import {
  notificationsApi,
  type Notification,
} from "@/features/notifications/api/notificationsApi";
import { formatDateTime } from "@/shared/utils/formatters";

export function NotificationDrawer() {
  const { notificationDrawerOpen, closeNotificationDrawer } = useUIStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list({ page: 1, page_size: 20, is_read: false }),
    enabled: notificationDrawerOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });

  const items = data?.items ?? [];

  return (
    <Drawer
      anchor="right"
      open={notificationDrawerOpen}
      onClose={closeNotificationDrawer}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 400 },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <NotificationsOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
        <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
          Notifications
        </Typography>
        {items.length > 0 && (
          <Tooltip title="Mark all as read">
            <span>
              <IconButton
                size="small"
                aria-label="Mark all notifications as read"
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
              >
                <DoneAllOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title="Close">
          <IconButton
            size="small"
            aria-label="Close notifications"
            onClick={closeNotificationDrawer}
          >
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Body */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {!isLoading && items.length === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, px: 3 }}>
            <NotificationsOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No new notifications
            </Typography>
          </Box>
        )}

        {!isLoading && items.length > 0 && (
          <List disablePadding>
            {items.map((n: Notification, index: number) => (
              <React.Fragment key={n.id}>
                {index > 0 && <Divider />}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => markReadMutation.mutate(n.id)}
                    sx={{
                      px: 2.5,
                      py: 1.75,
                      alignItems: "flex-start",
                      bgcolor: "action.hover",
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                  >
                    {/* Unread dot */}
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        flexShrink: 0,
                        mt: 0.75,
                        mr: 1.5,
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {n.subject ?? n.notification_type.replace(/_/g, " ")}
                        </Typography>
                      }
                      secondary={
                        <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            {n.body?.slice(0, 80)}{n.body?.length > 80 ? "…" : ""}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.5 }}>
                            {formatDateTime(n.created_at)}
                          </Typography>
                        </Box>
                      }
                      disableTypography
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
