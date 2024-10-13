import supabase from "@lib/supabase";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "./router";

export const client = createTRPCClient<AppRouter>({
	links: [
		loggerLink(),
		httpBatchLink({
			url: `${import.meta.env.VITE_BASE_URL}/api/trpc`,
			async headers() {
				const token = (await supabase.auth.getSession()).data.session
					?.access_token;
				if (!token) return {};
				return { Authorization: `Bearer ${token}` };
			},
		}),
	],
});
