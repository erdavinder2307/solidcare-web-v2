import { createTheme, type Theme } from "@mui/material/styles";
import { palette } from "./palette";
import { colors, densityTokens, fontFamily, radius, shadows, type DensityMode } from "./tokens";

declare module "@mui/material/styles" {
  interface Theme {
    solidcare: {
      density: DensityMode;
      tokens: typeof colors;
    };
  }
  interface ThemeOptions {
    solidcare?: {
      density?: DensityMode;
      tokens?: typeof colors;
    };
  }
}

export function createAppTheme(density: DensityMode = "comfortable"): Theme {
  const d = densityTokens[density];

  return createTheme({
    palette: {
      mode: "light",
      ...palette,
    },
    solidcare: {
      density,
      tokens: colors,
    },
    typography: {
      fontFamily: fontFamily.sans,
      h1: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, color: colors.neutral[900] },
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
    shape: { borderRadius: radius.md },
    shadows: [
      shadows.none,
      shadows.sm,
      shadows.md,
      shadows.lg,
      shadows.xl,
      shadows.xl,
      ...Array(19).fill(shadows.none),
    ] as Theme["shadows"],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          ".font-mono, .MuiTypography-fontMono": {
            fontFamily: fontFamily.mono,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            padding: density === "compact" ? "6px 16px" : "8px 20px",
            fontWeight: 500,
          },
          contained: {
            boxShadow: shadows.none,
            "&:hover": { boxShadow: shadows.sm },
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: radius.lg,
            boxShadow: shadows.none,
            "&:hover": { boxShadow: shadows.md },
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined", size: "small" },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: radius.md,
              backgroundColor: colors.neutral[50],
              "&:hover fieldset": { borderColor: colors.brand[600] },
              "&.Mui-focused fieldset": { borderColor: colors.brand[600] },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius.sm,
            fontWeight: 500,
            fontSize: "0.75rem",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: d.tableCellPadding,
            borderColor: colors.neutral[200],
          },
          head: {
            backgroundColor: colors.neutral[50],
            fontWeight: 600,
            fontSize: "0.8125rem",
            color: colors.neutral[700],
            textTransform: "none",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": { backgroundColor: colors.neutral[50] },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${colors.neutral[200]}`,
            backgroundColor: colors.neutral[0],
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            marginBottom: density === "compact" ? 2 : 4,
            minHeight: density === "compact" ? 36 : 38,
            borderLeft: "2px solid transparent",
            "&.Mui-selected": {
              backgroundColor: colors.brand[50],
              color: colors.brand[700],
              borderLeftColor: colors.brand[600],
              "&:hover": { backgroundColor: colors.brand[100] },
              "& .MuiListItemIcon-root": { color: colors.brand[600] },
            },
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.neutral[200]}`,
            backgroundColor: colors.neutral[0],
            color: colors.neutral[900],
            boxShadow: shadows.none,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { height: 2, borderRadius: 1 },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: radius.md },
        },
      },
    },
  });
}

/** Default theme instance (comfortable density). */
const theme = createAppTheme("comfortable");
export default theme;
