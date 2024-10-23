import { z } from "zod";
import type { CookieKey } from "../../../consts";

export function cookieExists(key: CookieKey) {
	return new RegExp(`(?:^|;\\s*)${key.replace(/[\-\.\+\*]/g, "\\$&")}\\s*\\=`).test(document.cookie);
}

export function removeCookie(key: CookieKey, path?: string) {
	if (!cookieExists(key)) return;
	document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${path ? `; path=${path}` : ""}`;
}

export function setCookie(key: CookieKey, value: string, end?: Date, path?: string, domain?: string, secure?: boolean) {
	let expires = "";
	if (end) expires = `; expires=${end.toString()}`;
	document.cookie = `${key}=${value}${expires}${domain ? `; domain=${domain}` : ""}${path ? `; path=${path}` : ""}${secure ? "; secure" : ""}`;
}

export function getCookie<T extends z.ZodSchema = z.ZodString>(key: CookieKey, schema?: T) {
	if (!cookieExists(key)) return;
	const value = document.cookie.replace(
		new RegExp(
			// biome-ignore lint/style/useTemplate: <explanation>
			"(?:^|.*;\\s*)" + key.replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*",
		),
		"$1",
	);

	return (schema ?? z.string()).parse(value) as z.infer<T>;
}
