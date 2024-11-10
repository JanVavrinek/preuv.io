import { and, count, eq } from "drizzle-orm";
import { db } from "..";
import { type CustomerSelectModel, customer } from "../schemas/customer";
import type { OrganizationSelectModel } from "../schemas/organization";
import { project } from "../schemas/project";
import { testimonial } from "../schemas/testimonial";

export async function selectListCustomer(
	customerId: CustomerSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
	return (
		await (tx ?? db)
			.select({ customer, project, testimonial_count: count(testimonial.id) })
			.from(customer)
			.innerJoin(project, eq(customer.project_id, project.id))
			.leftJoin(testimonial, eq(customer.id, testimonial.customer_id))
			.where(and(eq(project.organization_id, organizationId), eq(customer.id, customerId)))
			.groupBy(customer.id, project.id)
	).at(0);
}

export async function selectCustomer(
	customerId: CustomerSelectModel["id"],
	organizationId: OrganizationSelectModel["id"],
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0],
) {
	return (
		await (tx ?? db)
			.select({ customer, project })
			.from(customer)
			.innerJoin(project, eq(customer.project_id, project.id))
			.where(and(eq(project.organization_id, organizationId), eq(customer.id, customerId)))
	).at(0);
}
