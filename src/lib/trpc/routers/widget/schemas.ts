import { projectSelectModelSchema } from "@lib/db/schemas/project";
import { widgetInsertModelSchema, widgetSelectModelSchema } from "@lib/db/schemas/widget";
import { paginationSchema } from "@lib/trpc/schemas";
import { z } from "zod";

export const widgetGetManyQueryInputSchema = paginationSchema.extend({
	project: projectSelectModelSchema.shape.id.optional(),
});
export const widgetUpdateMutationInputSchema = z.object({
	id: widgetSelectModelSchema.shape.id,
	data: widgetSelectModelSchema.omit({ id: true, created_at: true }).partial(),
});

export const widgetCreateMutationInputSchema = widgetInsertModelSchema.omit({ created_at: true, id: true });
