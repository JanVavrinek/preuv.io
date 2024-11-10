import { and, eq } from "drizzle-orm";
import { db } from "..";
import type { OrganizationSelectModel } from "../schemas/organization";
import { type ProjectSelectModel, project } from "../schemas/project";

export async function selectProject(
	projectId: ProjectSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
	return await (tx ?? db).query.project.findFirst({
		where: and(eq(project.id, projectId), eq(project.organization_id, organizationId)),
	});
}
