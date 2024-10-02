export const appThemes = ["dark", "light"] as const;

export type AppTheme = (typeof appThemes)[number];
