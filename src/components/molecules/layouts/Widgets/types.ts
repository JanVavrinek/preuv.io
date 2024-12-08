import type { CustomerSelectModel } from "@lib/db/schemas/customer";
import type { TestimonialSelectModel } from "@lib/db/schemas/testimonial";

export type WidgetTestimonial = {
	testimonial: Pick<TestimonialSelectModel, "rating" | "text">;
	customer: Pick<CustomerSelectModel, "company" | "email" | "name" | "title" | "url">;
};
