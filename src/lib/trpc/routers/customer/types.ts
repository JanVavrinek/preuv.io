import type { CustomerSelectModel } from "@lib/db/schemas/customer";
import type { ProjectSelectModel } from "@lib/db/schemas/project";

export type ListCustomer = {
	customer: CustomerSelectModel;
	project: ProjectSelectModel;
	testimonial_count: number;
};
