import { db } from "@lib/db";
import { invite } from "@lib/db/schemas/invite";
import { organization } from "@lib/db/schemas/organization";
import { RolePermissions } from "@lib/db/schemas/role";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { count, eq } from "drizzle-orm";
import { inviteCreateMutationSchema } from "./schemas";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.input(paginationSchema)
		.query(async (opts) => {
			const [items, total] = await Promise.all([
				db
					.select({ invite, organization })
					.from(invite)
					.innerJoin(organization, eq(invite.organization_id, organization.id))
					.where(eq(invite.user_id, opts.ctx.user.sub))
					.offset(opts.input.offset)
					.limit(opts.input.limit),
				db
					.select({ count: count() })
					.from(invite)
					.innerJoin(organization, eq(invite.organization_id, organization.id))
					.where(eq(invite.user_id, opts.ctx.user.sub)),
			]);

			return { items, total: total.at(0)?.count ?? 0 };
		}),

	create: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(inviteCreateMutationSchema)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.MEMBER_INVITE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });
		}),
});
