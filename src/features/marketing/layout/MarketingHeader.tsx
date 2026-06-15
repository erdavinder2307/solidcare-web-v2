import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { SolidcareLogo } from "../components/SolidcareLogo";
import { COMPANY, NAV } from "../config/site";

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  return (
    <Button
      component={RouterLink}
      to={to}
      color="inherit"
      sx={{
        fontWeight: active ? 600 : 500,
        color: active ? "primary.main" : "text.primary",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      {label}
    </Button>
  );
}

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsAnchor, setSolutionsAnchor] = useState<null | HTMLElement>(null);
  const elevated = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  const mobileNav = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2 }}>
        <SolidcareLogo size="sm" />
      </Box>
      <List>
        <ListItemButton component={RouterLink} to={NAV.platform.path} onClick={() => setMobileOpen(false)}>
          <ListItemText primary={NAV.platform.label} />
        </ListItemButton>
        {NAV.solutions.map((item) => (
          <ListItemButton key={item.path} component={RouterLink} to={item.path} sx={{ pl: 4 }} onClick={() => setMobileOpen(false)}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton component={RouterLink} to={NAV.features.path} onClick={() => setMobileOpen(false)}>
          <ListItemText primary={NAV.features.label} />
        </ListItemButton>
        <ListItemButton component={RouterLink} to={NAV.pricing.path} onClick={() => setMobileOpen(false)}>
          <ListItemText primary={NAV.pricing.label} />
        </ListItemButton>
        <ListItemButton component={RouterLink} to={NAV.about.path} onClick={() => setMobileOpen(false)}>
          <ListItemText primary={NAV.about.label} />
        </ListItemButton>
        <ListItemButton component={RouterLink} to={NAV.security.path} onClick={() => setMobileOpen(false)}>
          <ListItemText primary={NAV.security.label} />
        </ListItemButton>
        <ListItemButton component={RouterLink} to={NAV.contact.path} onClick={() => setMobileOpen(false)}>
          <ListItemText primary={NAV.contact.label} />
        </ListItemButton>
      </List>
      <Box sx={{ px: 2, pt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Button component={RouterLink} to="/login" variant="outlined" fullWidth onClick={() => setMobileOpen(false)}>
          Login
        </Button>
        <Button
          href={COMPANY.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          fullWidth
          startIcon={<WhatsAppIcon />}
        >
          Request Demo
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={elevated ? 1 : 0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: elevated ? "divider" : "transparent",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 1 }}>
            <SolidcareLogo />

            <Box sx={{ flex: 1, display: { xs: "none", lg: "flex" }, alignItems: "center", ml: 4, gap: 0.5 }}>
              <NavLink to={NAV.platform.path} label={NAV.platform.label} />
              <Button
                color="inherit"
                endIcon={<ExpandMoreIcon />}
                onClick={(e) => setSolutionsAnchor(e.currentTarget)}
                sx={{ fontWeight: 500, color: "text.primary" }}
              >
                Solutions
              </Button>
              <Menu anchorEl={solutionsAnchor} open={Boolean(solutionsAnchor)} onClose={() => setSolutionsAnchor(null)}>
                {NAV.solutions.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={() => setSolutionsAnchor(null)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <NavLink to={NAV.features.path} label={NAV.features.label} />
              <NavLink to={NAV.pricing.path} label={NAV.pricing.label} />
              <NavLink to={NAV.about.path} label={NAV.about.label} />
              <NavLink to={NAV.security.path} label="Resources" />
              <NavLink to={NAV.contact.path} label={NAV.contact.label} />
            </Box>

            <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 1 }}>
              <Button component={RouterLink} to="/login" variant="text" color="inherit">
                Login
              </Button>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                href={COMPANY.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Request Demo
              </Button>
            </Box>

            <IconButton sx={{ display: { lg: "none" }, ml: "auto" }} onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {mobileNav}
      </Drawer>
    </>
  );
}
