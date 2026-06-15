/** Solidcare design tokens — single source for theme and component styling. */

export const colors = {
  neutral: {
    0: "#FFFFFF",
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  // Indigo brand — more distinctive than generic blue, professional for healthcare SaaS
  brand: {
    50:  "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  clinical: {
    50:  "#F0FDFA",
    100: "#CCFBF1",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
  },
  success: { main: "#16A34A", light: "#22C55E", dark: "#15803D", bg: "#F0FDF4", border: "#86EFAC" },
  warning: { main: "#D97706", light: "#F59E0B", dark: "#B45309", bg: "#FFFBEB", border: "#FCD34D" },
  danger:  { main: "#DC2626", light: "#EF4444", dark: "#B91C1C", bg: "#FEF2F2", border: "#FCA5A5" },
  info:    { main: "#0284C7", light: "#0EA5E9", dark: "#0369A1", bg: "#F0F9FF", border: "#7DD3FC" },
} as const;

/** Healthcare-specific status color tokens for appointment/clinical states. */
export const healthcareStatusColors = {
  scheduled:       { fg: "#0369A1", bg: "#E0F2FE" },
  confirmed:       { fg: "#0369A1", bg: "#E0F2FE" },
  checked_in:      { fg: "#92400E", bg: "#FEF3C7" },
  in_consultation: { fg: "#0F766E", bg: "#CCFBF1" },
  completed:       { fg: "#15803D", bg: "#DCFCE7" },
  cancelled:       { fg: "#475569", bg: "#F1F5F9" },
  no_show:         { fg: "#B91C1C", bg: "#FEE2E2" },
  critical:        { fg: "#B91C1C", bg: "#FEE2E2" },
  urgent:          { fg: "#C2410C", bg: "#FFEDD5" },
  routine:         { fg: "#15803D", bg: "#DCFCE7" },
  elective:        { fg: "#475569", bg: "#F1F5F9" },
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
  md: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)",
  lg: "0 4px 12px 0 rgba(15, 23, 42, 0.1)",
  xl: "0 8px 24px 0 rgba(15, 23, 42, 0.12)",
} as const;

export const fontFamily = {
  sans: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace",
} as const;

/** 4px-base spacing scale — use for layout rhythm across shell and pages. */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  8: 48,
} as const;

export type SpacingKey = keyof typeof spacing;

export type DensityMode = "comfortable" | "compact";

export const densityTokens = {
  comfortable: {
    tableCellPadding: "12px 16px",
    tableRowHeight: 48,
    pagePadding: spacing[4],
    cardPadding: spacing[4],
    sectionGap: spacing[4],
    gridGap: spacing[4],
    formGap: spacing[4],
  },
  compact: {
    tableCellPadding: "8px 12px",
    tableRowHeight: 40,
    pagePadding: spacing[3],
    cardPadding: spacing[3],
    sectionGap: spacing[3],
    gridGap: spacing[3],
    formGap: spacing[3],
  },
} as const;
