import type { FormSelectModel } from "@lib/db/schemas/form";
import type { ProjectSelectModel } from "@lib/db/schemas/project";

export type ListForm = {
	form: FormSelectModel;
	project: ProjectSelectModel;
	unique_visits: number;
	total_visits: number;
};
