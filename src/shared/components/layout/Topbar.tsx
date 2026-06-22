import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Chip,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import DensitySmallOutlinedIcon from "@mui/icons-material/DensitySmallOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/app/store/uiStore";
import { useAuthStore } from "@/app/store/authStore";
import { useNavigate } from "react-router-dom";
import { notificationsApi } from "@/features/notifications/api/notificationsApi";
import { useLayoutDimensions } from "@/shared/layout/useLayoutDimensions";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function Topbar() {
  const {
    sidebarOpen,
    toggleSidebar,
    setMobileNavOpen,
    mobileNavOpen,
    toggleNotificationDrawer,
    toggleCommandPalette,
    density,
    setDensity,
  } = useUIStore();
  const { user, logoutAsync } = useAuthStore();
  const navigate = useNavigate();
  const { isMobile, mainOffset, topbarHeight } = useLayoutDimensions();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { data: unread } = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () => notificationsApi.unreadCount(),
    refetchInterval: 60_000,
  });

  const handleLogout = async () => {
    await logoutAsync();
    navigate("/login");
  };

  const handleNavToggle = () => {
    if (isMobile) {
      setMobileNavOpen(!mobileNavOpen);
    } else {
      toggleSidebar();
    }
  };

  const initials = user ? `${user.email[0]}`.toUpperCase() : "U";

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        width: isMobile ? "100%" : `calc(100% - ${mainOffset}px)`,
        ml: `${mainOffset}px`,
        height: topbarHeight,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) =>
          theme.transitions.create(["width", "margin-left"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          height: topbarHeight,
          minHeight: `${topbarHeight}px !important`,
          px: { xs: 1.5, sm: 2 },
          gap: 1,
        }}
      >
        <Tooltip title={sidebarOpen || isMobile ? "Collapse menu" : "Expand menu"}>
          <IconButton
            onClick={handleNavToggle}
            size="small"
            aria-label={isMobile ? "Open navigation menu" : "Toggle sidebar"}
            sx={{ color: "text.secondary" }}
          >
            {sidebarOpen && !isMobile ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>

        {/* Workspace switcher — visible on all sizes */}
        <WorkspaceSwitcher />

        {isMobile && (
          <Typography variant="body2" fontWeight={700} color="primary.main" noWrap>
            Solidcare
          </Typography>
        )}

        <Box flexGrow={1} />

        <Tooltip title="Search and actions (Cmd+K)">
          <IconButton
            size="small"
            aria-label="Open command palette"
            sx={{ color: "text.secondary" }}
            onClick={toggleCommandPalette}
          >
            <SearchOutlinedIcon />
          </IconButton>
        </Tooltip>

        {/* Notifications — opens right-anchored drawer */}
        <Tooltip title="Notifications">
          <IconButton
            size="small"
            aria-label="Open notifications"
            sx={{ color: "text.secondary" }}
            onClick={toggleNotificationDrawer}
          >
            <Badge badgeContent={unread?.count ?? 0} color="error" max={9}>
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User account menu */}
        <Tooltip title="Account">
          <IconButton
            size="small"
            aria-label="Account menu"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.875rem" }}>
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{ sx: { minWidth: 220, mt: 0.5 } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.roles.join(", ")}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/settings");
            }}
          >
            <ListItemIcon>
              <PersonOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Profile &amp; Settings
          </MenuItem>
          <Divider />
          {/* Density toggle */}
          <MenuItem
            onClick={() => setDensity(density === "comfortable" ? "compact" : "comfortable")}
          >
            <ListItemIcon>
              {density === "comfortable"
                ? <DensitySmallOutlinedIcon fontSize="small" />
                : <DensityMediumOutlinedIcon fontSize="small" />}
            </ListItemIcon>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Density
              <Chip
                label={density}
                size="small"
                sx={{ height: 18, fontSize: "0.6875rem", textTransform: "capitalize" }}
              />
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" color="error" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
