import { TRPCError } from "@trpc/server";
import { middleware } from "../init";

export const isAuthorized = middleware(async (opts) => {
	if (!opts.ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
	return opts.next({
		ctx: {
			user: opts.ctx.user,
		},
	});
});
