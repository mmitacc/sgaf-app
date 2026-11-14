import type { CSSProperties } from "react";

export const RECHARTS_THEME = {
  primaryColor: "var(--color-primary)",
  secondaryColor: "var(--color-secondary)",
  surfaceColor: "var(--color-bg-card)",
  gridStroke: "color-mix(in srgb, var(--color-text-sub) 18%, transparent)",
  axisStroke: "color-mix(in srgb, var(--color-text-sub) 25%, transparent)",
  tickStyle: {
    fill: "var(--color-text-sub)",
    fontSize: 12,
  },
  cursorStyle: {
    fill: "color-mix(in srgb, var(--color-text-sub) 10%, transparent)",
  },
  tooltipContentStyle: {
    backgroundColor: "var(--color-bg-card)",
    borderColor: "color-mix(in srgb, var(--color-text-sub) 22%, transparent)",
    borderRadius: "0.75rem",
    color: "var(--color-text-main)",
    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.35)",
  } satisfies CSSProperties,
  tooltipItemStyle: {
    color: "var(--color-text-main)",
    fontSize: "13px",
    fontWeight: 600,
  } satisfies CSSProperties,
  tooltipLabelStyle: {
    color: "var(--color-text-sub)",
    fontSize: "12px",
    marginBottom: "4px",
  } satisfies CSSProperties,
  legendStyle: {
    color: "var(--color-text-main)",
    fontSize: "12px",
    paddingTop: "12px",
  } satisfies CSSProperties,
};
