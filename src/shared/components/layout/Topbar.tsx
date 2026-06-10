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
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useUIStore } from "@/app/store/uiStore";
import { useAuthStore } from "@/app/store/authStore";
import { useNavigate } from "react-router-dom";

const TOPBAR_HEIGHT = 64;

export function Topbar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user
    ? `${user.email[0]}`.toUpperCase()
    : "U";

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        ml: 0,
        height: TOPBAR_HEIGHT,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ height: TOPBAR_HEIGHT, gap: 1 }}>
        <IconButton onClick={toggleSidebar} size="small" sx={{ color: "text.secondary" }}>
          {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>

        <Box flexGrow={1} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <Badge badgeContent={3} color="error" max={9}>
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User menu */}
        <Tooltip title="Account">
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
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
          PaperProps={{ sx: { minWidth: 200, mt: 0.5 } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600}>{user?.email}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.roles.join(", ")}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate("/settings"); }}>
            <ListItemIcon><PersonOutlinedIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon><LogoutOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
