import { createSecretKey } from "node:crypto";
import type { APIEvent } from "@solidjs/start/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import * as jose from "jose";
import { z } from "zod";

const payload = z.object({
	sub: z.string().uuid(),
	email: z.string().email(),
	role: z.string(),
});

export async function createContext(opts: FetchCreateContextFnOptions, event: APIEvent) {
	const token = opts.req.headers.get("Authorization")?.split(" ");
	if (!token || token.length !== 2) return {};
	const secretKey = createSecretKey(import.meta.env.VITE_JWT_SECRET, "utf-8");
	const user = payload.safeParse((await jose.jwtVerify(token[1], secretKey)).payload);
	return { user: user.data, event };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
