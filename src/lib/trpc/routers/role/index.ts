import { db } from "@lib/db";
import { getUsersRoleAndOrganization } from "@lib/db/queries/role";
import {} from "@lib/db/schemas/organization";
import { RolePermissions, role, roleInsertModelSchema, roleSelectModelSchema } from "@lib/db/schemas/role";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, asc, count, eq, isNull } from "drizzle-orm";

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
					.limit(opts.input.limit)
					.orderBy(asc(role.id)),
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
				const res = await getUsersRoleAndOrganization(opts.ctx.user.sub, opts.ctx.organizationId, tx);
				if (!hasPermission(RolePermissions.ROLE_UPDATE, res.role)) throw new TRPCError({ code: "UNAUTHORIZED" });

				const updateRole = await tx.query.role.findFirst({
					where: and(eq(role.id, opts.input.id), eq(role.organization_id, res.organization.id)),
					columns: { id: true, owner: true },
				});
				if (!updateRole) throw new TRPCError({ code: "NOT_FOUND" });

				const updatedRole = (
					await tx
						.update(role)
						.set({ name: opts.input.name, permissions: updateRole.owner ? [] : opts.input.permissions })
						.where(eq(role.id, updateRole.id))
						.returning()
				).at(0);

				if (!updatedRole) throw new TRPCError({ code: "NOT_FOUND" });

				return updatedRole;
			});
		}),
	delete: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(roleSelectModelSchema.shape.id)
		.mutation(async (opts) => {
			await db.transaction(async (tx) => {
				const res = await getUsersRoleAndOrganization(opts.ctx.user.sub, opts.ctx.organizationId, tx);
				if (!hasPermission(RolePermissions.ROLE_DELETE, res.role)) throw new TRPCError({ code: "UNAUTHORIZED" });

				const deletionRole = await tx.query.role.findFirst({
					where: and(eq(role.id, opts.input), eq(role.organization_id, res.organization.id), isNull(role.owner)),
				});
				if (!deletionRole) throw new TRPCError({ code: "NOT_FOUND" });
				await tx
					.delete(role)
					.where(and(eq(role.id, opts.input), isNull(role.owner), eq(role.organization_id, res.organization.id)));
			});
		}),
	create: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(roleInsertModelSchema.pick({ name: true, permissions: true }))
		.mutation(async (opts) => {
			return db.transaction(async (tx) => {
				const res = await getUsersRoleAndOrganization(opts.ctx.user.sub, opts.ctx.organizationId, tx);
				if (!hasPermission(RolePermissions.ROLE_CREATE, res.role)) throw new TRPCError({ code: "UNAUTHORIZED" });
				const newRole = (
					await db
						.insert(role)
						.values({
							name: opts.input.name,
							permissions: opts.input.permissions,
							organization_id: opts.ctx.organizationId,
						})
						.returning()
				).at(0);
				if (!newRole) throw new TRPCError({ code: "BAD_REQUEST" });
				return newRole;
			});
		}),
});
