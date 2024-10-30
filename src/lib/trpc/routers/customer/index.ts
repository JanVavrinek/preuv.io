import { db } from "@lib/db";
import { customer } from "@lib/db/schemas/customer";
import { project } from "@lib/db/schemas/project";
import { testimonial } from "@lib/db/schemas/testimonial";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import type { Collection } from "@lib/trpc/types";
import { count, desc, eq } from "drizzle-orm";
import type { ListCustomer } from "./types";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(paginationSchema)
		.query(async (opts): Promise<Collection<ListCustomer>> => {
			const [customers, total] = await Promise.all([
				db
					.select({ customer, project, testimonial_count: count(testimonial.id) })
					.from(customer)
					.innerJoin(project, eq(customer.project_id, project.id))
					.leftJoin(testimonial, eq(customer.id, testimonial.customer_id))
					.where(eq(project.organization_id, opts.ctx.role.organization.id))
					.groupBy(customer.id, project.id)
					.offset(opts.input.offset)
					.limit(opts.input.limit)
					.orderBy(desc(customer.created_at)),
				db
					.select({ count: count() })
					.from(customer)
					.innerJoin(project, eq(customer.project_id, project.id))
					.where(eq(project.organization_id, opts.ctx.role.organization.id)),
			]);
			return { items: customers, total: total.at(0)?.count ?? 0 };
		}),
});
