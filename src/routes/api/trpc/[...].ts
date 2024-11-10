import { createContext } from "@lib/trpc/context";
import { appRouter } from "@lib/trpc/router";
import type { APIEvent } from "@solidjs/start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (event: APIEvent) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req: event.request,
		router: appRouter,
		createContext: (opts) => createContext(opts, event),
	});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
