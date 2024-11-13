import type { CustomerSelectModel } from "@lib/db/schemas/customer";
import type { TestimonialSelectModel } from "@lib/db/schemas/testimonial";
import type { widgetCommentsTypeOptionsSchema } from "@lib/db/schemas/widget";
import type { z } from "zod";

export type CommentsWidgetProps = {
	testimonials: { testimonial: TestimonialSelectModel; customer: CustomerSelectModel }[];
	options: z.infer<typeof widgetCommentsTypeOptionsSchema>;
};
