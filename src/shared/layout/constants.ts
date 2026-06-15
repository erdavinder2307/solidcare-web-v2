/** Shared layout dimensions for the application shell. */
export const LAYOUT = {
  SIDEBAR_WIDTH: 240,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  TOPBAR_HEIGHT: 56,
  /** Used only for focused forms/settings — operational pages use full width. */
  CONTENT_MAX_WIDTH: 1440,
  FORM_MAX_WIDTH: 800,
  MOBILE_BREAKPOINT: 1024,
} as const;

export type LayoutConstants = typeof LAYOUT;
