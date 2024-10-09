import type { AvailableLanguage } from "@lib/i18n/translations";

export function formatDate(
	d: Date,
	locale: AvailableLanguage = "en",
	options?: Intl.DateTimeFormatOptions,
) {
	return d.toLocaleDateString(
		locale,
		options ?? {
			day: "2-digit",
			month: "short",
			year: "numeric",
		},
	);
}
