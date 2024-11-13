import type { CustomerSelectModel } from "@lib/db/schemas/customer";
import type { TestimonialSelectModel } from "@lib/db/schemas/testimonial";
import type { widgetSimpleTypeOptionsSchema } from "@lib/db/schemas/widget";
import type { z } from "zod";

export type SimpleWidgetProps = {
	testimonials: { testimonial: TestimonialSelectModel; customer: CustomerSelectModel }[];
	options: z.infer<typeof widgetSimpleTypeOptionsSchema>;
};
