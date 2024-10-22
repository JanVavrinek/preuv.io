import { db } from "@lib/db";
import { getUsersOrganizations } from "@lib/db/queries/organization";
import { member } from "@lib/db/schemas/member";
import {
	type OrganizationSelectModel,
	organization,
	organizationSelectModelSchema,
} from "@lib/db/schemas/organization";
import { type RoleSelectModel, role } from "@lib/db/schemas/role";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { TRPCError } from "@trpc/server";
import { organizationCreateMutationInputSchema } from "./schemas";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.input(paginationSchema)
		.query(async (opts) => {
			return getUsersOrganizations(
				opts.ctx.user.sub,
				undefined,
				opts.input.offset,
				opts.input.limit,
			);
		}),
	getOne: procedure
		.use(isAuthorized)
		.input(organizationSelectModelSchema.shape.id)
		.query(async (opts) => {
			return (
				await getUsersOrganizations(opts.ctx.user.sub, opts.input, 0, 1)
			).at(0);
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
				const org = (
					await db
						.insert(organization)
						.values({ name: opts.input.organizationName })
						.returning()
				).at(0);
				if (!org) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
				const createdRole = (
					await db
						.insert(role)
						.values({
							name: opts.input.ownerRoleName,
							permissions: [],
							owner: true,
							organization_id: org.id,
						})
						.returning()
				).at(0);
				if (!createdRole)
					throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

				await db.insert(member).values({
					user_id: opts.ctx.user.sub,
					role_id: createdRole.id,
				});
				return { organization: org, role: createdRole };
			},
		),
});
