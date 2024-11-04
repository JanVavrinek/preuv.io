import { customerInsertModelSchema, customerSelectModelSchema } from "@lib/db/schemas/customer";
import { projectSelectModelSchema } from "@lib/db/schemas/project";
import { paginationSchema } from "@lib/trpc/schemas";

export const customerUpdateMutationInputSchema = customerSelectModelSchema.omit({ created_at: true });
export const customerCreateMutationInputSchema = customerInsertModelSchema.omit({ created_at: true, id: true });
export const customerGetManyQueryInputSchema = paginationSchema.extend({
	project: projectSelectModelSchema.shape.id.optional(),
});
