import supabase from "@lib/supabase";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
import { HeaderKeys, LocalStorageKey } from "../../consts";
import type { AppRouter } from "./router";
export const client = createTRPCClient<AppRouter>({
	links: [
		loggerLink(),
		httpBatchLink({
			url: `${import.meta.env.VITE_BASE_URL}/api/trpc`,
			async headers() {
				let headers = {};
				const activeOrganization = localStorage.getItem(LocalStorageKey.ACTIVE_ORGANIZATION);
				if (activeOrganization) headers = { [HeaderKeys.ORGANIZATION_ID]: activeOrganization };

				const token = (await supabase.auth.getSession()).data.session?.access_token;
				if (!token) return headers;
				return { ...headers, Authorization: `Bearer ${token}` };
			},
			transformer: superjson,
		}),
	],
});
