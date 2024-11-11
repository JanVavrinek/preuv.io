import type { ListForm } from "@lib/trpc/routers/form/types";
import { and, count, eq, sql, sum } from "drizzle-orm";
import { db } from "..";
import { type FormSelectModel, form } from "../schemas/form";
import { formVisit } from "../schemas/formVisit";
import type { OrganizationSelectModel } from "../schemas/organization";
import { project } from "../schemas/project";

export async function selectListForm(
	formId: FormSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
): Promise<ListForm | undefined> {
	return (
		await (tx ?? db)
			.select({
				form,
				project,
				total_visits: sql`COALESCE(${sum(formVisit.visits)}, 0)`.mapWith(Number),
				unique_visits: count(formVisit.id),
			})
			.from(form)
			.innerJoin(project, eq(form.project_id, project.id))
			.leftJoin(formVisit, eq(formVisit.form_id, form.id))
			.where(and(eq(project.organization_id, organizationId), eq(form.id, formId)))
			.groupBy(form.id, project.id)
	).at(0);
}

export async function selectForm(
	formId: FormSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
	return (
		await (tx ?? db)
			.select({ form, project })
			.from(form)
			.innerJoin(project, eq(project.id, form.project_id))
			.where(and(eq(form.id, formId), eq(project.organization_id, organizationId)))
	).at(0);
}
