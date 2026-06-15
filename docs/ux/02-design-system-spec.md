# Solidcare V2 — Enterprise Design System Specification
> Version 1.0 | 2026-06-11

---

## Philosophy

**Linear** for structural clarity and information density.  
**Stripe** for data presentation and trust signals.  
**AthenaOne** for healthcare workflow cognition.

> The system must communicate: *professional, calm, precise, trustworthy.*  
> It must never communicate: *consumer app, hospital kiosk, or bootstrap template.*

---

## 1. Color System

### 1.1 Brand Palette (Update `tokens.ts`)

```ts
colors = {
  // Neutral — Slate family (unchanged — good choice)
  neutral: {
    0:   "#FFFFFF",
    50:  "#F8FAFC",
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

  // Brand — shift from pure blue to a more distinctive indigo-blue
  brand: {
    50:  "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    400: "#818CF8",
    500: "#6366F1",   // PRIMARY — Indigo (more distinctive than generic blue)
    600: "#4F46E5",   // PRIMARY MAIN
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },

  // Clinical — keep teal (excellent healthcare association)
  clinical: {
    50:  "#F0FDFA",
    100: "#CCFBF1",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
  },

  // Semantic — unchanged
  success: { main: "#16A34A", light: "#22C55E", dark: "#15803D", bg: "#F0FDF4", border: "#86EFAC" },
  warning: { main: "#D97706", light: "#F59E0B", dark: "#B45309", bg: "#FFFBEB", border: "#FCD34D" },
  danger:  { main: "#DC2626", light: "#EF4444", dark: "#B91C1C", bg: "#FEF2F2", border: "#FCA5A5" },
  info:    { main: "#0284C7", light: "#0EA5E9", dark: "#0369A1", bg: "#F0F9FF", border: "#7DD3FC" },
}
```

### 1.2 Healthcare-Specific Status Colors

```ts
healthcareStatus = {
  // Appointment states
  scheduled:       { fg: "#0369A1", bg: "#E0F2FE" },  // Blue
  confirmed:       { fg: "#0369A1", bg: "#E0F2FE" },  // Blue
  checked_in:      { fg: "#92400E", bg: "#FEF3C7" },  // Amber
  in_consultation: { fg: "#0F766E", bg: "#CCFBF1" },  // Teal
  completed:       { fg: "#15803D", bg: "#DCFCE7" },  // Green
  cancelled:       { fg: "#475569", bg: "#F1F5F9" },  // Neutral
  no_show:         { fg: "#B91C1C", bg: "#FEE2E2" },  // Red

  // Clinical urgency
  critical:   { fg: "#B91C1C", bg: "#FEE2E2", pulse: true },
  urgent:     { fg: "#C2410C", bg: "#FFEDD5" },
  routine:    { fg: "#15803D", bg: "#DCFCE7" },
  elective:   { fg: "#475569", bg: "#F1F5F9" },

  // Allergy severity
  allergyHigh:   "#DC2626",
  allergyMedium: "#D97706",
  allergyLow:    "#0284C7",
}
```

### 1.3 Background Architecture

```
App Shell bg:     neutral[50]   (#F8FAFC)  — very light slate
Sidebar bg:       neutral[0]    (#FFFFFF)  — pure white sidebar (Linear pattern)
Topbar bg:        neutral[0]    (#FFFFFF)  — white, 1px border-bottom
Content area:     neutral[50]             — subtle differentiation from panels
Surface/Card:     neutral[0]    (#FFFFFF)  — white panels on slate bg
Active nav item:  brand[50]               — very light brand wash
```

---

## 2. Typography System

### 2.1 Font Stack

```ts
fontFamily = {
  sans:    "'Inter var', 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  mono:    "'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace",
  medical: "'Inter var', sans-serif",  // Same as sans — no decorative fonts in medical
}
```

### 2.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display` | 2.25rem | 700 | 1.1 | Marketing / landing only |
| `h1` | 1.75rem | 700 | 1.2 | Page titles (rare) |
| `h2` | 1.375rem | 700 | 1.25 | Section headings |
| `h3` | 1.125rem | 600 | 1.35 | Card headings, workspace titles |
| `h4` | 1rem | 600 | 1.4 | Sub-headings, panel titles |
| `h5` | 0.875rem | 600 | 1.45 | Field group labels, sidebar section labels |
| `body1` | 0.875rem | 400 | 1.6 | Default body text |
| `body2` | 0.8125rem | 400 | 1.55 | Secondary text, table cells |
| `caption` | 0.75rem | 400 | 1.4 | Metadata, timestamps, helper text |
| `label` | 0.75rem | 500 | 1.0 | Form labels, badge labels (UPPERCASE) |
| `mono` | 0.8125rem | 400 | 1.5 | UHID, codes, IDs, timestamps |
| `kpi` | 2rem | 700 | 1.0 | Dashboard metric values |

### 2.3 Typography Hierarchy Rules

1. **Never use h1 inside content pages** — reserve for branding contexts only
2. **KPI values** use `kpi` variant, not `h4` — prevents semantic mismatch
3. **IDs and codes** (UHID, invoice #, token #) always use `mono` variant
4. **Labels in forms** use `label` variant (0.75rem, 500 weight, uppercase)
5. **Table headers** use `body2` + `fontWeight: 600` — not uppercase

---

## 3. Spacing System

### 3.1 Base Unit: 4px

```
4px   (1)  — Micro gaps, icon padding
8px   (2)  — Component internal gaps
12px  (3)  — Form field margins, tight sections
16px  (4)  — Standard gaps, card internal padding
20px  (5)  — Section gaps (comfortable)
24px  (6)  — Page padding (comfortable)
32px  (8)  — Major section separation
40px  (10) — Page section breaks
48px  (12) — Workspace section breaks
```

### 3.2 Density Tokens (updated)

```ts
densityTokens = {
  comfortable: {
    tableCellPadding: "12px 16px",
    tableRowHeight: 48,
    pagePadding: 24,
    formGap: 20,
    sidebarWidth: 240,
    sidebarCollapsedWidth: 56,
    topbarHeight: 52,
    cardPadding: "20px 24px",
    sectionGap: 32,
  },
  compact: {
    tableCellPadding: "8px 12px",
    tableRowHeight: 36,
    pagePadding: 16,
    formGap: 12,
    sidebarWidth: 220,
    sidebarCollapsedWidth: 48,
    topbarHeight: 44,
    cardPadding: "12px 16px",
    sectionGap: 20,
  },
}
```

---

## 4. Elevation System

```
Level 0 — Flat (bg)        no shadow, no border
Level 1 — Surface          border: 1px solid neutral[200]
Level 2 — Card             border + shadow-sm
Level 3 — Raised panel     border + shadow-md  (dropdowns, tooltips)
Level 4 — Modal / overlay  shadow-lg + backdrop
Level 5 — Toast / floating shadow-xl
```

```ts
shadows = {
  none: "none",
  sm:   "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
  md:   "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.06)",
  lg:   "0 4px 12px -2px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.06)",
  xl:   "0 8px 24px -4px rgba(15, 23, 42, 0.12), 0 4px 8px -4px rgba(15, 23, 42, 0.08)",
  focus:"0 0 0 3px rgba(99, 102, 241, 0.25)",  // Brand focus ring
}
```

---

## 5. Border Radius System

```ts
radius = {
  xs:  4,   // Chips, badges, small tags
  sm:  6,   // Buttons, inputs (compact)
  md:  8,   // Buttons (default), inputs, cards
  lg:  12,  // Cards, panels, modals
  xl:  16,  // Large modals, overlays
  full: 9999, // Pills, avatars, circular elements
}
```

**Rules:**
- All interactive controls: `radius.md` (8px)
- Cards/surfaces: `radius.lg` (12px)
- Status badges: `radius.xs` (4px) — square feels more clinical, authoritative
- Avatars: `radius.full`
- Modals: `radius.xl`

---

## 6. Iconography Standards

### Icon Set
Use **Material Symbols Outlined** (not filled) as the default.  
Use **filled** variant ONLY for active/selected states.

### Icon Sizes

| Context | Size | MUI Prop |
|---------|------|----------|
| Navigation sidebar | 20px | `fontSize="small"` |
| Topbar actions | 20px | `fontSize="small"` |
| Button prefix | 18px | custom `sx={{ fontSize: 18 }}` |
| Status indicators | 16px | `fontSize="small"` |
| KPI card icons | 24px | `fontSize="medium"` |
| Empty state | 48px | `sx={{ fontSize: 48 }}` |

### Icon Usage Rules
1. Never use an icon without a label visible on desktop
2. Icon-only buttons must have `aria-label` + `Tooltip`
3. Use consistent icons per domain: calendar=appointments, people=patients, receipt=billing
4. Do not mix icon families (no mixing MUI + custom SVG without a wrapper)

---

## 7. Data Visualization Standards

### Chart Colors (sequential)

```ts
chartColors = {
  primary:    ["#4F46E5", "#818CF8", "#C7D2FE"],  // Brand indigo
  clinical:   ["#0D9488", "#2DD4BF", "#CCFBF1"],  // Teal
  comparison: ["#4F46E5", "#0D9488", "#D97706", "#DC2626"], // Multi-series
  neutral:    ["#334155", "#64748B", "#CBD5E1"],  // Muted
}
```

### Chart Rules
1. **No pie charts** — use horizontal bar charts for proportional data (easier to read)
2. **All charts must have axis labels and grid lines** — no chart without context
3. **Tooltips required** on all data points
4. **Empty state** for charts with no data — never render an empty Recharts container
5. **Trend indicators**: use `↑ 12%` text labels rather than decorative arrows
6. Line charts for time-series, bar charts for comparisons, sparklines for inline KPIs

---

## 8. Component Visual Specifications

### 8.1 Status Badges (redesign)

Current: MUI `Chip` with `variant="outlined"`.  
Target: Custom `StatusBadge` with semantic color fills.

```
Pattern: [dot] [label]
Shape: radius.xs (4px) — square-ish, medical authority
Size: 20px height, px: 8px, font: 0.6875rem, weight: 500
```

```ts
// Badge styles per status
scheduled:       { bg: "#E0F2FE", fg: "#0369A1", dot: "#0369A1" }
in_consultation: { bg: "#CCFBF1", fg: "#0F766E", dot: "#0F766E" }
completed:       { bg: "#DCFCE7", fg: "#15803D", dot: "#15803D" }
critical:        { bg: "#FEE2E2", fg: "#B91C1C", dot: "#B91C1C", pulse: true }
```

### 8.2 Sidebar Navigation Items

```
Default:    px:12, py:8, radius:6, fg:neutral[600], icon:neutral[500]
Hover:      bg:neutral[100], fg:neutral[900]
Active:     bg:brand[50], fg:brand[700], icon:brand[600], fontWeight:600
            left-border: 2px solid brand[600]
```

### 8.3 Tables (Stripe-inspired)

```
Header:    bg:neutral[0], borderBottom:2px solid neutral[200], text:neutral[600], fontSize:0.8125rem, weight:500
Row:       bg:neutral[0], borderBottom:1px solid neutral[100], height:48px (comfortable)
Row hover: bg:neutral[50]
Row click: bg:brand[50]/40%
Cell text: neutral[900] for primary, neutral[500] for secondary
```

### 8.4 Forms

```
Label:        0.75rem, weight:500, neutral[700], mb:4px
Input:        border:1px solid neutral[300], radius:md(8px), bg:neutral[0]
Input focus:  border:brand[500], box-shadow:focus ring
Input error:  border:danger.main, helper text:danger.main
Field groups: labeled sections with neutral[100] bg + 1px border, radius:lg
Spacing:      formGap(20px) between fields
```

---

## 9. Motion & Animation

```ts
transitions = {
  fast:     "120ms ease-out",   // Hover, focus states
  standard: "200ms ease-out",   // Sidebar collapse, dropdown open
  slow:     "350ms ease-in-out",// Page transitions, panel slide
  spring:   "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",  // Confirmation animations
}
```

**Rules:**
- `prefers-reduced-motion`: all animations must have `@media (prefers-reduced-motion)` fallbacks
- No decorative animations in clinical workflows (consultation, prescribing)
- Loading states: skeleton screens, not spinners (except page-level full-screen loads)

---

## 10. Dark Mode Strategy

Phase 1 (current): Light mode only — do not add dark mode until Phase F.  
Reason: Healthcare environments use light interfaces as standard; dark mode adds maintenance burden before core UX is stable.  
Preparation: All colors MUST come from tokens/palette — no hardcoded hex in `sx` props.
