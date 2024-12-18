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
import invite from "./routers/invite";
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
				return await db.transaction(async (tx) => {
					const org = (await tx.insert(organization).values({ name: opts.input.organizationName }).returning()).at(0);

					if (!org) throw new TRPCError({ code: "NOT_FOUND" });

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

					if (!createdRole) throw new TRPCError({ code: "NOT_FOUND" });

					await tx.insert(member).values({
						user_id: opts.ctx.user.sub,
						role_id: createdRole.id,
					});
					return { organization: org, role: createdRole };
				});
			},
		),
	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(organizationSelectModelSchema.pick({ name: true }))
		.mutation(async (opts) => {
			const update = await db.transaction(async (tx) => {
				if (!hasPermission(RolePermissions.ORGANIZATION_UPDATE, opts.ctx.role.role))
					throw new TRPCError({ code: "FORBIDDEN" });

				const org = (
					await tx
						.update(organization)
						.set({ name: opts.input.name })
						.where(eq(organization.id, opts.ctx.role.organization.id))
						.returning()
				).at(0);
				if (!org) {
					tx.rollback();
					return;
				}
				return org;
			});
			if (!update) throw new TRPCError({ code: "NOT_FOUND" });
			return update;
		}),

	invite,
});
