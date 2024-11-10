import type { CustomerSelectModel } from "@lib/db/schemas/customer";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import type { TestimonialSelectModel } from "@lib/db/schemas/testimonial";

export type ListTestimonial = {
	customer: CustomerSelectModel;
	project: ProjectSelectModel;
	testimonial: TestimonialSelectModel;
};
