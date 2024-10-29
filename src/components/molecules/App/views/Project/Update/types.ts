import type { ProjectSelectModel } from "@lib/db/schemas/project";

export type UpdateProjectProps = {
	project: ProjectSelectModel;
	onUpdate: (project: ProjectSelectModel) => void;
};
