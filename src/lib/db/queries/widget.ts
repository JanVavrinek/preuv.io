import type { ListWidget } from "@lib/trpc/routers/widget/types";
import { and, eq } from "drizzle-orm";
import { db } from "..";
import type { OrganizationSelectModel } from "../schemas/organization";
import { project } from "../schemas/project";
import { type WidgetSelectModel, widget } from "../schemas/widget";

export async function selectListWidget(
	widgetId: WidgetSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
): Promise<ListWidget | undefined> {
	return (
		await (tx ?? db)
			.select({
				widget,
				project,
			})
			.from(widget)
			.innerJoin(project, eq(widget.project_id, project.id))
			.where(and(eq(project.organization_id, organizationId), eq(widget.id, widgetId)))
	).at(0);
}

export async function selectWidget(
	widgetId: WidgetSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
	return (
		await (tx ?? db)
			.select({ widget, project })
			.from(widget)
			.innerJoin(project, eq(project.id, widget.project_id))
			.where(and(eq(widget.id, widgetId), eq(project.organization_id, organizationId)))
	).at(0);
}
