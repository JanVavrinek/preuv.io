import { projectSelectModelSchema } from "@lib/db/schemas/project";
import { z } from "zod";

export const updatePhotoMutationInputSchema = z.object({
	project: projectSelectModelSchema.shape.id,
	image: z.string(),
});
