import { customerSelectModelSchema } from "@lib/db/schemas/customer";
import { projectSelectModelSchema } from "@lib/db/schemas/project";
import { testimonialInsertModelSchema } from "@lib/db/schemas/testimonial";
import { paginationSchema } from "@lib/trpc/schemas";

export const testimonialGetManyQueryInputSchema = paginationSchema.extend({
	project: projectSelectModelSchema.shape.id.optional(),
	customer: customerSelectModelSchema.shape.id.optional(),
});

export const testimonialCreateMutationInputSchema = testimonialInsertModelSchema.omit({
	id: true,
});
