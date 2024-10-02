import { type AvailableLanguage, availableLanguages } from "./translations";

export const isLocale = (locale: string): locale is AvailableLanguage =>
	availableLanguages.includes(locale as AvailableLanguage);

export const pt = (
	values: Partial<Record<Intl.LDMLPluralRule, string>>,
	count: number,
	language: AvailableLanguage,
) => {
	return values[new Intl.PluralRules(language).select(count)] ?? "";
};
