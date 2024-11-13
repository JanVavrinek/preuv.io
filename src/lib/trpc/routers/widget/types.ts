import type { ProjectSelectModel } from "@lib/db/schemas/project";
import type { WidgetSelectModel } from "@lib/db/schemas/widget";

export type ListWidget = {
	widget: WidgetSelectModel;
	project: ProjectSelectModel;
};
