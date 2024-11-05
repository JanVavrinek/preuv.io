import type { CustomerSelectModel } from "@lib/db/schemas/customer";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import type { TestimonialSelectModel } from "@lib/db/schemas/testimonial";

export type TestimonialProps = {
	testimonial: TestimonialSelectModel;
	customer: CustomerSelectModel;
	project: ProjectSelectModel;

	/** Custom classes applied to the element */
	class?: string;
};
