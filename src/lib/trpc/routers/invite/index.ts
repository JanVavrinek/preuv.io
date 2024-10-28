import { db } from "@lib/db";
import { invite } from "@lib/db/schemas/invite";
import { member } from "@lib/db/schemas/member";
import { organization, organizationSelectModelSchema } from "@lib/db/schemas/organization";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { TRPCError } from "@trpc/server";
import { and, count, eq } from "drizzle-orm";

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

	decline: procedure
		.use(isAuthorized)
		.input(organizationSelectModelSchema.shape.id)
		.mutation(async (opts) => {
			await db.delete(invite).where(and(eq(invite.organization_id, opts.input), eq(invite.user_id, opts.ctx.user.sub)));
		}),

	accept: procedure
		.use(isAuthorized)
		.input(organizationSelectModelSchema.shape.id)
		.mutation(async (opts) => {
			await db.transaction(async (tx) => {
				const invitation = await tx.query.invite.findFirst({
					where: and(eq(invite.organization_id, opts.input), eq(invite.user_id, opts.ctx.user.sub)),
				});
				if (!invitation) throw new TRPCError({ code: "NOT_FOUND" });
				await tx.insert(member).values({ user_id: opts.ctx.user.sub, role_id: invitation.role_id });
				await tx
					.delete(invite)
					.where(and(eq(invite.organization_id, opts.input), eq(invite.user_id, opts.ctx.user.sub)));
			});
		}),
});
