import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "..";
import { member } from "../schemas/member";
import { type OrganizationSelectModel, organization } from "../schemas/organization";
import { role } from "../schemas/role";
import type { UserSelectModel } from "../schemas/user";

export async function getUsersRoleAndOrganization(
	userId: UserSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	con?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
	const res = (
		await (con ?? db)
			.select({ organization, role })
			.from(organization)
			.innerJoin(role, eq(role.organization_id, organization.id))
			.innerJoin(member, eq(role.id, member.role_id))
			.where(and(eq(member.user_id, userId), eq(organization.id, organizationId)))
	).at(0);
	if (!res) throw new TRPCError({ code: "NOT_FOUND" });
	return res;
}
