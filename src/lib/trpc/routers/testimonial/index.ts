import { db } from "@lib/db";
import { selectListTestimonial } from "@lib/db/queries/testimonial";
import { customer } from "@lib/db/schemas/customer";
import { project } from "@lib/db/schemas/project";
import { testimonial, testimonialSelectModelSchema } from "@lib/db/schemas/testimonial";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import type { Collection } from "@lib/trpc/types";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq } from "drizzle-orm";
import { testimonialGetManyQueryInputSchema } from "./schemas";
import type { ListTestimonial } from "./types";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(testimonialGetManyQueryInputSchema)
		.query(async (opts): Promise<Collection<ListTestimonial>> => {
			const [customers, total] = await Promise.all([
				db
					.select({ testimonial, project, customer })
					.from(testimonial)
					.innerJoin(project, eq(testimonial.project_id, project.id))
					.innerJoin(customer, eq(testimonial.customer_id, customer.id))
					.where(
						and(
							eq(project.organization_id, opts.ctx.role.organization.id),
							opts.input.project ? eq(project.id, opts.input.project) : undefined,
							opts.input.customer ? eq(customer.id, opts.input.customer) : undefined,
						),
					)
					.offset(opts.input.offset)
					.limit(opts.input.limit)
					.orderBy(desc(customer.created_at)),
				db
					.select({ count: count() })
					.from(testimonial)
					.innerJoin(project, eq(testimonial.project_id, project.id))
					.innerJoin(customer, eq(testimonial.customer_id, customer.id))
					.where(
						and(
							eq(project.organization_id, opts.ctx.role.organization.id),
							opts.input.project ? eq(project.id, opts.input.project) : undefined,
							opts.input.customer ? eq(customer.id, opts.input.customer) : undefined,
						),
					),
			]);
			return { items: customers, total: total.at(0)?.count ?? 0 };
		}),

	getOne: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(testimonialSelectModelSchema.shape.id)
		.query(async (opts): Promise<ListTestimonial> => {
			const found = await selectListTestimonial(opts.input, opts.ctx.role.organization.id);
			if (!found) throw new TRPCError({ code: "NOT_FOUND" });
			return found;
		}),
});
