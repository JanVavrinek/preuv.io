import { db } from "@lib/db";
import { type InviteInsertModel, invite, inviteSelectModelSchema } from "@lib/db/schemas/invite";
import { member } from "@lib/db/schemas/member";
import { organization } from "@lib/db/schemas/organization";
import { RolePermissions, role } from "@lib/db/schemas/role";
import { user } from "@lib/db/schemas/user";
import { RealtimeBroadcastEvents } from "@lib/supabase/realtime";
import { supabaseServiceClient } from "@lib/supabase/server";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, count, eq, exists, inArray, not } from "drizzle-orm";
import { organizationCreateInviteMutationSchema } from "./schemas";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(paginationSchema)
		.query(async (opts) => {
			const [items, total] = await Promise.all([
				db
					.select({ invite, user, role })
					.from(invite)
					.innerJoin(organization, eq(invite.organization_id, organization.id))
					.innerJoin(user, eq(invite.user_id, user.id))
					.innerJoin(role, eq(invite.role_id, role.id))
					.where(eq(invite.organization_id, opts.ctx.role.organization.id))
					.offset(opts.input.offset)
					.limit(opts.input.limit),
				db
					.select({ count: count() })
					.from(invite)
					.innerJoin(organization, eq(invite.organization_id, organization.id))
					.where(eq(invite.organization_id, opts.ctx.role.organization.id)),
			]);

			return { items, total: total.at(0)?.count ?? 0 };
		}),
	create: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(organizationCreateInviteMutationSchema)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.INVITE_CREATE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });

			const uniqueEmails = new Set<string>(opts.input.map((i) => i.email));
			const users = await db
				.select()
				.from(user)
				.where(
					and(
						inArray(user.email, [...uniqueEmails]),
						not(
							exists(
								db
									.select()
									.from(invite)
									.where(and(eq(invite.organization_id, opts.ctx.role.organization.id), eq(invite.user_id, user.id))),
							),
						),
						not(
							exists(
								db
									.select()
									.from(member)
									.innerJoin(role, eq(member.role_id, role.id))
									.where(and(eq(role.organization_id, opts.ctx.role.organization.id), eq(member.user_id, user.id))),
							),
						),
					),
				);

			const uniqueRoleIds = new Set<number>(opts.input.map((i) => i.role));
			const roles = await db
				.select({ id: role.id })
				.from(role)
				.where(and(inArray(role.id, [...uniqueRoleIds]), eq(role.organization_id, opts.ctx.role.organization.id)));

			const invites: InviteInsertModel[] = [];
			for (const u of users) {
				const inputInvite = opts.input.find((i) => i.email === u.email);
				if (!inputInvite) continue;
				const inviteRole = roles.find((r) => r.id === inputInvite.role);
				if (!inviteRole) continue;
				invites.push({
					organization_id: opts.ctx.role.organization.id,
					user_id: u.id,
					role_id: inviteRole.id,
				});
			}
			if (invites.length) {
				await db.insert(invite).values(invites);
				for (const invite of invites) {
					const c = supabaseServiceClient.channel(invite.user_id, { config: { private: true } });
					c.send({ type: "broadcast", event: RealtimeBroadcastEvents.INVITE_CREATE, payload: {} });
				}
			}
		}),

	delete: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(inviteSelectModelSchema.shape.user_id)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.INVITE_DELETE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });
			await db
				.delete(invite)
				.where(and(eq(invite.user_id, opts.input), eq(invite.organization_id, opts.ctx.role.organization.id)));
		}),
});
