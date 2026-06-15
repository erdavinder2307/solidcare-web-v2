import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/app/store/authStore";
import { useUIStore } from "@/app/store/uiStore";
import { LAYOUT } from "@/shared/layout/constants";
import { useLayoutDimensions } from "@/shared/layout/useLayoutDimensions";
import {
  BOTTOM_NAV_ITEMS,
  NAV_GROUPS,
  canSeeNavItem,
  isNavItemActive,
  type NavItemConfig,
} from "@/shared/layout/navigation";

interface SidebarContentProps {
  expanded: boolean;
  onNavigate?: () => void;
}

function SidebarContent({ expanded, onNavigate }: SidebarContentProps) {
  const can = useAuthStore((s) => s.can);
  const hasRole = useAuthStore((s) => s.hasRole);
  const navigate = useNavigate();
  const location = useLocation();

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => canSeeNavItem(item, can, hasRole)),
  })).filter((group) => group.items.length > 0);

  const visibleBottomItems = BOTTOM_NAV_ITEMS.filter((item) => canSeeNavItem(item, can, hasRole));

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const NavItem = ({ label, icon, path, excludePrefixes }: NavItemConfig) => {
    const active = isNavItemActive(location.pathname, path, excludePrefixes);
    return (
      <Tooltip title={!expanded ? label : ""} placement="right" arrow>
        <ListItemButton
          selected={active}
          onClick={() => handleNavigate(path)}
          aria-current={active ? "page" : undefined}
          sx={{
            px: expanded ? 1.5 : 1,
            justifyContent: expanded ? "flex-start" : "center",
            minHeight: 38,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: expanded ? 36 : "auto",
              color: active ? "primary.main" : "text.secondary",
              "& .MuiSvgIcon-root": { fontSize: 20 },
            }}
          >
            {icon}
          </ListItemIcon>
          {expanded && (
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: active ? 600 : 400,
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    );
  };

  return (
    <>
      <Box
        sx={{
          px: expanded ? 2.5 : 1.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minHeight: LAYOUT.TOPBAR_HEIGHT,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography variant="body2" fontWeight={700} color="white">
            S
          </Typography>
        </Box>
        {expanded && (
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body1" fontWeight={700} color="primary.main" lineHeight={1.1} noWrap>
              Solidcare
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Healthcare Platform
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, px: 0.75, py: 1, overflowY: "auto" }}>
        {visibleGroups.map((group, groupIndex) => (
          <Box key={group.id} sx={{ mb: groupIndex < visibleGroups.length - 1 ? 1 : 0 }}>
            {expanded && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{
                  display: "block",
                  px: 1.5,
                  py: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  fontSize: "0.6875rem",
                }}
              >
                {group.label}
              </Typography>
            )}
            {!expanded && groupIndex > 0 && <Divider sx={{ my: 1 }} />}
            <List dense disablePadding>
              {group.items.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
            </List>
          </Box>
        ))}
      </Box>

      <Divider />

      <Box sx={{ px: 1, py: 1.5 }}>
        <List dense disablePadding>
          {visibleBottomItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </List>
      </Box>
    </>
  );
}

export function Sidebar() {
  const { sidebarOpen, mobileNavOpen, closeMobileNav } = useUIStore();
  const { isMobile, drawerWidth } = useLayoutDimensions();
  const location = useLocation();

  React.useEffect(() => {
    if (isMobile) closeMobileNav();
  }, [location.pathname, isMobile, closeMobileNav]);

  const paperSx = {
    width: isMobile ? LAYOUT.SIDEBAR_WIDTH : drawerWidth,
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  };

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileNavOpen}
        onClose={closeMobileNav}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": paperSx }}
      >
        <SidebarContent expanded onNavigate={closeMobileNav} />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          ...paperSx,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <SidebarContent expanded={sidebarOpen} />
    </Drawer>
  );
}
