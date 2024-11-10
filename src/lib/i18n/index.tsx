import {
	type ChainedTranslator,
	type Translator,
	chainedTranslator,
	flatten,
	translator,
} from "@solid-primitives/i18n";
import { getCookie as clientGetCookie } from "@utils/cookies";
import { type Accessor, type ParentComponent, type Setter, createContext, createMemo, createSignal } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie, getEvent } from "vinxi/server";
import { z } from "zod";
import { CookieKey } from "../../consts";
import { type AvailableLanguage, availableLanguages, dictionaries } from "./translations";
import type { Dictionary } from "./types";
import { isLocale } from "./utils";

const getLanguage = () => {
	"use server";
	const event = getEvent();
	if (!event) return availableLanguages[0];
	return getCookie(event, CookieKey.LANGUAGE) ?? availableLanguages[0];
};

export const i18nContext = createContext<{
	t: Translator<Dictionary> | undefined;
	locale: Accessor<AvailableLanguage>;
	setLocale: Setter<AvailableLanguage>;
	c: ChainedTranslator<typeof dictionaries.en> | undefined;
}>({
	t: undefined,
	locale: () => availableLanguages[0],
	setLocale: () => {},
	c: undefined,
});

const I18nProvider: ParentComponent = (props) => {
	let storedLanguage: string = availableLanguages[0];
	try {
		storedLanguage =
			(isServer ? getLanguage() : clientGetCookie(CookieKey.LANGUAGE, z.enum(availableLanguages))) ??
			availableLanguages[0];
	} catch {}

	const language = isLocale(storedLanguage) ? storedLanguage : availableLanguages[0];

	const [locale, setLocale] = createSignal<AvailableLanguage>(language);

	const dictionary = createMemo(() => flatten(dictionaries[locale()]));
	const t = translator(dictionary);
	const c = chainedTranslator(dictionaries.en, t);

	return <i18nContext.Provider value={{ t, locale, setLocale, c }}>{props.children}</i18nContext.Provider>;
};
export default I18nProvider;
