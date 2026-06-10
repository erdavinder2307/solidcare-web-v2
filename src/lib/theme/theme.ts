import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";

const theme = createTheme({
  palette: {
    mode: "light",
    ...palette,
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2 },
    h3: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: "0.875rem", lineHeight: 1.6 },
    body2: { fontSize: "0.8125rem", lineHeight: 1.5 },
    caption: { fontSize: "0.75rem", lineHeight: 1.4 },
    button: { fontSize: "0.875rem", fontWeight: 500, textTransform: "none" },
  },
  shape: { borderRadius: 8 },
  shadows: [
    "none",
    "0 1px 2px 0 rgba(0,0,0,0.05)",
    "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
    "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
    "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    ...Array(19).fill("none"),
  ] as any,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, padding: "8px 20px", fontWeight: 500 },
        contained: {
          "&:hover": { boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          "&:hover": { boxShadow: "0 4px 6px -1px rgba(0,0,0,0.08)" },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#FAFAFA",
            "&:hover fieldset": { borderColor: "#1565C0" },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 500 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#F8FAFC",
            fontWeight: 600,
            fontSize: "0.8125rem",
            color: "#374151",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: "1px solid #E5E7EB" },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          "&.Mui-selected": {
            backgroundColor: "#E3F2FD",
            color: "#1565C0",
            "& .MuiListItemIcon-root": { color: "#1565C0" },
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
          color: "#1A1A2E",
        },
      },
    },
  },
});

export default theme;
