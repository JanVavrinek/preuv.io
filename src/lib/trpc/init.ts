import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
