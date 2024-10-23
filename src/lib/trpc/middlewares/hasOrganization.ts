import { TRPCError } from "@trpc/server";
import { middleware } from "../init";

export const hasOrganization = middleware(async (opts) => {
	const organizationId = opts.ctx.organizationId;
	if (!organizationId) throw new TRPCError({ code: "UNAUTHORIZED" });
	return opts.next({
		ctx: {
			organizationId,
		},
	});
});
