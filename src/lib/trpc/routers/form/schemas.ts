import { formSelectModelSchema } from "@lib/db/schemas/form";
import { projectSelectModelSchema } from "@lib/db/schemas/project";
import { paginationSchema } from "@lib/trpc/schemas";
import { z } from "zod";

export const formGetManyQueryInputSchema = paginationSchema.extend({
	project: projectSelectModelSchema.shape.id.optional(),
});

export const formUpdateMutationInputSchema = z.object({
	id: formSelectModelSchema.shape.id,
	data: formSelectModelSchema.omit({ id: true, created_at: true }).partial(),
});
