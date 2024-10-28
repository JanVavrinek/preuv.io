import { db } from "@lib/db";
import { deleteMemberByUserAndRole } from "@lib/db/queries/member";
import { member, memberSelectModelSchema } from "@lib/db/schemas/member";
import {} from "@lib/db/schemas/organization";
import { RolePermissions, role } from "@lib/db/schemas/role";
import { user } from "@lib/db/schemas/user";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, count, eq } from "drizzle-orm";

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

	delete: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(memberSelectModelSchema.shape.user_id)
		.mutation(async (opts) => {
			const foundMember = (
				await db
					.select({ member, role })
					.from(member)
					.innerJoin(role, eq(member.role_id, role.id))
					.where(and(eq(role.organization_id, opts.ctx.role.organization.id), eq(member.user_id, opts.input)))
			).at(0);

			if (!foundMember) throw new TRPCError({ code: "NOT_FOUND" });
			if (foundMember.role.owner) throw new TRPCError({ code: "FORBIDDEN" });
			if (foundMember.member.user_id === opts.ctx.user.sub)
				return deleteMemberByUserAndRole(foundMember.member.user_id, foundMember.member.role_id);
			if (!hasPermission(RolePermissions.MEMBER_DELETE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });
			return deleteMemberByUserAndRole(foundMember.member.user_id, foundMember.member.role_id);
		}),
});
