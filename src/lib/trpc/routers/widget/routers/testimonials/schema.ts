import { testimonialSelectModelSchema } from "@lib/db/schemas/testimonial";
import { widgetSelectModelSchema } from "@lib/db/schemas/widget";
import { z } from "zod";

export const widgetTestimonialUpdateMutationInputSchema = z.object({
	id: widgetSelectModelSchema.shape.id,
	testimonials: z.set(testimonialSelectModelSchema.shape.id),
});
