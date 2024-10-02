import {
	getCookie as clientGetCookie,
	setCookie as clientSetCookie,
	cookieExists,
	removeCookie,
} from "@utils/cookies";
import {
	type Accessor,
	type ParentProps,
	createContext,
	createSignal,
	onMount,
} from "solid-js";
import { isServer } from "solid-js/web";
import { CookieKey } from "../../consts";
import { appThemeSchema } from "./schemas";
import type { AppTheme } from "./types";

export const appThemeContext = createContext<{
	theme: Accessor<AppTheme | undefined>;
	setTheme: (theme?: AppTheme) => void;
}>({
	theme: () => undefined,
	setTheme: () => {},
});

export function AppThemeProvider(props: ParentProps) {
	function updateTheme(theme?: AppTheme) {
		setTheme(theme);
		if (isServer) return;
		document.body.classList.remove("dark");
		if (!theme) {
			removeCookie(CookieKey.THEME);
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				if (!document.body.classList.contains("dark"))
					document.body.classList.add("dark");
			}
		} else {
			clientSetCookie(CookieKey.THEME, theme);
			if (theme === "dark") document.body.classList.add("dark");
		}
	}

	function getTheme() {
		let theme: AppTheme | undefined;
		if (isServer) return theme;
		try {
			if (
				!cookieExists(CookieKey.THEME) &&
				window.matchMedia("(prefers-color-scheme: dark)").matches
			) {
				document.body.classList.add("dark");
				return;
			}
			theme = clientGetCookie(CookieKey.THEME, appThemeSchema);
		} catch {
			removeCookie(CookieKey.THEME);
		}
		updateTheme(theme);
		return theme;
	}

	const [theme, setTheme] = createSignal<AppTheme | undefined>();

	onMount(getTheme);

	return (
		<appThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
			{props.children}
		</appThemeContext.Provider>
	);
}
