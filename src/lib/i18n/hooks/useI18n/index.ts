import { setCookie } from "@utils/cookies";
import { useContext } from "solid-js";
import { i18nContext } from "../..";
import { CookieKey } from "../../../../consts";
import type { AvailableLanguage } from "../../translations";

const useI18n = () => {
	const { t, setLocale, locale, c } = useContext(i18nContext);

	if (!t || !c) throw new Error("Translator is not available");

	const setLanguage = (lng: AvailableLanguage) => {
		setLocale(lng);
		setCookie(CookieKey.LANGUAGE, lng);
	};

	return { t, setLocale: setLanguage, locale, c };
};

export default useI18n;
