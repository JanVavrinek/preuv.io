import { getUsersOrganizations } from "@lib/db/queries/organization";
import { organizationSelectModelSchema } from "@lib/db/schemas/organization";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { paginationSchema } from "@lib/trpc/schemas/pagination";

export default router({
	getOrganizations: procedure
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
	getOrganization: procedure
		.use(isAuthorized)
		.input(organizationSelectModelSchema.shape.id)
		.query(async (opts) => {
			return (
				await getUsersOrganizations(opts.ctx.user.sub, opts.input, 0, 1)
			).at(0);
		}),
});
