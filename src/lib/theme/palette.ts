import { colors } from "./tokens";

export const palette = {
  primary: {
    main: colors.brand[600],
    light: colors.brand[500],
    dark: colors.brand[700],
    contrastText: colors.neutral[0],
  },
  secondary: {
    main: colors.clinical[600],
    light: colors.clinical[500],
    dark: colors.clinical[700],
    contrastText: colors.neutral[0],
  },
  success: {
    main: colors.success.main,
    light: colors.success.light,
    dark: colors.success.dark,
  },
  warning: {
    main: colors.warning.main,
    light: colors.warning.light,
    dark: colors.warning.dark,
  },
  error: {
    main: colors.danger.main,
    light: colors.danger.light,
    dark: colors.danger.dark,
  },
  info: {
    main: colors.info.main,
    light: colors.info.light,
    dark: colors.info.dark,
  },
  grey: {
    50: colors.neutral[50],
    100: colors.neutral[100],
    200: colors.neutral[200],
    300: colors.neutral[300],
    400: colors.neutral[400],
    500: colors.neutral[500],
    600: colors.neutral[600],
    700: colors.neutral[700],
    800: colors.neutral[800],
    900: colors.neutral[900],
  },
  background: {
    default: colors.neutral[50],
    paper: colors.neutral[0],
  },
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[500],
    disabled: colors.neutral[400],
  },
  divider: colors.neutral[200],
};
