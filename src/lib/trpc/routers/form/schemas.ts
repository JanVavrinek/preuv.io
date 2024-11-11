import { projectSelectModelSchema } from "@lib/db/schemas/project";
import { paginationSchema } from "@lib/trpc/schemas";

export const formGetManyQueryInputSchema = paginationSchema.extend({
	project: projectSelectModelSchema.shape.id.optional(),
});
