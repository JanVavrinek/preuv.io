import { and, eq } from "drizzle-orm";
import { db } from "..";
import { customer } from "../schemas/customer";
import type { OrganizationSelectModel } from "../schemas/organization";
import { project } from "../schemas/project";
import { type TestimonialSelectModel, testimonial } from "../schemas/testimonial";

export async function selectListTestimonial(
	testimonialId: TestimonialSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
	return (
		await (tx ?? db)
			.select({ customer, project, testimonial })
			.from(testimonial)
			.innerJoin(project, eq(testimonial.project_id, project.id))
			.innerJoin(customer, eq(testimonial.project_id, customer.id))
			.where(and(eq(testimonial.id, testimonialId), eq(project.organization_id, organizationId)))
	).at(0);
}
