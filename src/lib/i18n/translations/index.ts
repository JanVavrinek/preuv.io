import en from "./en";

export const availableLanguages = ["en"] as const;
export type AvailableLanguage = (typeof availableLanguages)[number];

export const dictionaries: Record<AvailableLanguage, typeof en> = {
	en,
} as const;
