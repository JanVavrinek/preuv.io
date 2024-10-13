import { createSecretKey } from "node:crypto";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import * as jose from "jose";

export async function createContext(opts: FetchCreateContextFnOptions) {
	const token = opts.req.headers.get("Authorization")?.split(" ");
	if (!token || token.length !== 2) return {};
	const secretKey = createSecretKey(import.meta.env.VITE_JWT_SECRET, "utf-8");
	const user = await jose.jwtVerify(token[1], secretKey);
	return { user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
