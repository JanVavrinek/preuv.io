import { and, eq } from "drizzle-orm";
import { db } from "..";
import { member } from "../schemas/member";
import { type OrganizationSelectModel, organization } from "../schemas/organization";
import { role } from "../schemas/role";
import type { UserSelectModel } from "../schemas/user";

/**
 * Select organization user is member of
 * @param userId for which user to load the organizations
 * @param organizationId if set it is going to look for a specific organization
 * @param offset pagination offset
 * @param limit pagination limit
 */
export async function getUsersOrganizations(
	userId: UserSelectModel["id"],
	organizationId?: OrganizationSelectModel["id"],
	offset = 0,
	limit = 20,
	con?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
	const query = (con ?? db)
		.select({ organization, role })
		.from(organization)
		.offset(offset)
		.limit(limit)
		.innerJoin(role, eq(role.organization_id, organization.id))
		.innerJoin(member, eq(role.id, member.role_id));
	if (organizationId) query.where(and(eq(member.user_id, userId), eq(organization.id, organizationId)));
	else query.where(eq(member.user_id, userId));
	return await query;
}
