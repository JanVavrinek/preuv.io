import { db } from "@lib/db";
import { selectCustomer } from "@lib/db/queries/customer";
import { selectProject } from "@lib/db/queries/project";
import { selectListTestimonial } from "@lib/db/queries/testimonial";
import { customer } from "@lib/db/schemas/customer";
import { project } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import { testimonial, testimonialSelectModelSchema } from "@lib/db/schemas/testimonial";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import type { Collection } from "@lib/trpc/types";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, count, desc, eq } from "drizzle-orm";
import { testimonialCreateMutationInputSchema, testimonialGetManyQueryInputSchema } from "./schemas";
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
					.orderBy(desc(testimonial.created_at)),
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
	create: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(testimonialCreateMutationInputSchema)
		.mutation(async (opts): Promise<ListTestimonial> => {
			if (!hasPermission(RolePermissions.TESTIMONIAL_CREATE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });
			return await db.transaction(async (tx): Promise<ListTestimonial> => {
				const foundProject = await selectProject(opts.input.project_id, opts.ctx.role.organization.id, tx);
				if (!foundProject) throw new TRPCError({ code: "NOT_FOUND" });

				const foundCustomer = (await selectCustomer(opts.input.customer_id, opts.ctx.role.organization.id, tx))
					?.customer;
				if (!foundCustomer) throw new TRPCError({ code: "NOT_FOUND" });

				const returned = (await tx.insert(testimonial).values(opts.input).returning()).at(0);
				if (!returned) throw new TRPCError({ code: "NOT_FOUND" });

				return {
					testimonial: returned,
					customer: foundCustomer,
					project: foundProject,
				};
			});
		}),

	delete: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(testimonialSelectModelSchema.shape.id)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.TESTIMONIAL_DELETE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });
			await db.transaction(async (tx) => {
				const id = (
					await tx.query.testimonial.findFirst({
						where: and(eq(testimonial.id, opts.input), eq(project.organization_id, opts.ctx.role.organization.id)),
						with: {
							project: true,
						},
						columns: {
							id: true,
						},
					})
				)?.id;
				if (!id) throw new TRPCError({ code: "NOT_FOUND" });
				await tx.delete(testimonial).where(eq(testimonial.id, id));
			});
		}),

	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(testimonialSelectModelSchema)
		.mutation(async (opts): Promise<ListTestimonial> => {
			if (!hasPermission(RolePermissions.TESTIMONIAL_UPDATE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });
			return await db.transaction(async (tx): Promise<ListTestimonial> => {
				const foundProject = await selectProject(opts.input.project_id, opts.ctx.role.organization.id, tx);
				if (!foundProject) throw new TRPCError({ code: "NOT_FOUND" });

				const foundCustomer = (await selectCustomer(opts.input.customer_id, opts.ctx.role.organization.id, tx))
					?.customer;
				if (!foundCustomer) throw new TRPCError({ code: "NOT_FOUND" });

				const updated = (
					await tx
						.update(testimonial)
						.set({ ...opts.input, id: undefined })
						.where(and(eq(testimonial.id, opts.input.id), eq(testimonial.project_id, foundProject.id)))
						.returning()
				).at(0);
				if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
				return {
					testimonial: updated,
					customer: foundCustomer,
					project: foundProject,
				};
			});
		}),
});
