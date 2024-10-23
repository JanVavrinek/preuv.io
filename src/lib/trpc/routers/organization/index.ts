import { db } from "@lib/db";
import { getUsersOrganizations } from "@lib/db/queries/organization";
import { member } from "@lib/db/schemas/member";
import {
	type OrganizationSelectModel,
	organization,
	organizationSelectModelSchema,
} from "@lib/db/schemas/organization";
import { RolePermissions, type RoleSelectModel, role } from "@lib/db/schemas/role";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { eq } from "drizzle-orm";
import { organizationCreateMutationInputSchema } from "./schemas";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.input(paginationSchema)
		.query(async (opts) => {
			return getUsersOrganizations(opts.ctx.user.sub, undefined, opts.input.offset, opts.input.limit);
		}),
	getOne: procedure
		.use(isAuthorized)
		.input(organizationSelectModelSchema.shape.id)
		.query(async (opts) => {
			return (await getUsersOrganizations(opts.ctx.user.sub, opts.input, 0, 1)).at(0);
		}),
	create: procedure
		.use(isAuthorized)
		.input(organizationCreateMutationInputSchema)
		.mutation(
			async (
				opts,
			): Promise<{
				organization: OrganizationSelectModel;
				role: RoleSelectModel;
			}> => {
				const res = await db.transaction(async (tx) => {
					const org = (await tx.insert(organization).values({ name: opts.input.organizationName }).returning()).at(0);

					if (!org) {
						tx.rollback();
						return;
					}

					const createdRole = (
						await tx
							.insert(role)
							.values({
								name: opts.input.ownerRoleName,
								permissions: [],
								owner: true,
								organization_id: org.id,
							})
							.returning()
					).at(0);

					if (!createdRole) {
						tx.rollback();
						return;
					}

					await tx.insert(member).values({
						user_id: opts.ctx.user.sub,
						role_id: createdRole.id,
					});
					return { organization: org, role: createdRole };
				});
				if (!res) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
				return res;
			},
		),
	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(organizationSelectModelSchema.pick({ name: true }))
		.mutation(async (opts) => {
			const update = await db.transaction(async (tx) => {
				const res = (await getUsersOrganizations(opts.ctx.user.sub, opts.ctx.organizationId, 0, 1, tx)).at(0);
				if (!hasPermission(RolePermissions.ORGANIZATION_UPDATE, res?.role))
					throw new TRPCError({ code: "UNAUTHORIZED" });
				const org = (
					await tx
						.update(organization)
						.set({ name: opts.input.name })
						.where(eq(organization.id, opts.ctx.organizationId))
						.returning()
				).at(0);
				if (!org) {
					tx.rollback();
					return;
				}
				return org;
			});
			if (!update) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			return update;
		}),
});
