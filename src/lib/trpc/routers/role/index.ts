import { db } from "@lib/db";
import { getUsersOrganizations } from "@lib/db/queries/organization";
import {} from "@lib/db/schemas/organization";
import { RolePermissions, role, roleSelectModelSchema } from "@lib/db/schemas/role";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { count, eq } from "drizzle-orm";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(paginationSchema)
		.query(async (opts) => {
			const [roles, total] = await Promise.all([
				db
					.select()
					.from(role)
					.where(eq(role.organization_id, opts.ctx.organizationId))
					.offset(opts.input.offset)
					.limit(opts.input.limit),
				db.select({ count: count() }).from(role).where(eq(role.organization_id, opts.ctx.organizationId)),
			]);

			return { items: roles, total: total.at(0)?.count ?? 0 };
		}),
	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(roleSelectModelSchema.pick({ name: true, permissions: true, id: true }))
		.mutation(async (opts) => {
			return await db.transaction(async (tx) => {
				const res = (await getUsersOrganizations(opts.ctx.user.sub, opts.ctx.organizationId, 0, 1, tx)).at(0);
				if (!hasPermission(RolePermissions.ROLE_UPDATE, res?.role)) throw new TRPCError({ code: "UNAUTHORIZED" });

				const updateRole = (
					await tx
						.update(role)
						.set({ name: opts.input.name, permissions: opts.input.permissions })
						.where(eq(role.id, opts.input.id))
						.returning()
				).at(0);
				if (!updateRole) {
					tx.rollback();
					throw new TRPCError({ code: "NOT_FOUND" });
				}
				return updateRole;
			});
		}),
});
