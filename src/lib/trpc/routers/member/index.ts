import { db } from "@lib/db";
import { member } from "@lib/db/schemas/member";
import {} from "@lib/db/schemas/organization";
import { role } from "@lib/db/schemas/role";
import { user } from "@lib/db/schemas/user";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { count, eq } from "drizzle-orm";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(paginationSchema)
		.query(async (opts) => {
			const [members, total] = await Promise.all([
				db
					.select({ role, user, member })
					.from(member)
					.innerJoin(role, eq(member.role_id, role.id))
					.innerJoin(user, eq(member.user_id, user.id))
					.where(eq(role.organization_id, opts.ctx.role.organization.id))
					.offset(opts.input.offset)
					.limit(opts.input.limit),
				db
					.select({ count: count() })
					.from(member)
					.innerJoin(role, eq(role.id, member.role_id))
					.where(eq(role.organization_id, opts.ctx.role.organization.id)),
			]);

			return { items: members, total: total.at(0)?.count ?? 0 };
		}),
});
