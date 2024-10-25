import { getUsersRoleAndOrganization } from "@lib/db/queries/role";
import { TRPCError } from "@trpc/server";
import { middleware } from "../init";

export const hasOrganization = middleware(async (opts) => {
	const organizationId = opts.ctx.organizationId;
	if (!organizationId) throw new TRPCError({ code: "UNAUTHORIZED" });
	const role = await getUsersRoleAndOrganization(opts.ctx.user?.sub ?? "", organizationId);

	return opts.next({
		ctx: {
			role,
		},
	});
});
