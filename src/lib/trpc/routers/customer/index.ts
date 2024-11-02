import { db } from "@lib/db";
import { selectCustomer, selectListCustomer } from "@lib/db/queries/customer";
import { customer, customerInsertModelSchema, customerSelectModelSchema } from "@lib/db/schemas/customer";
import { project } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import { testimonial } from "@lib/db/schemas/testimonial";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas/pagination";
import type { Collection } from "@lib/trpc/types";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, count, desc, eq } from "drizzle-orm";
import { customerUpdateMutationInputSchema } from "./schemas";
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

	getOne: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(customerSelectModelSchema.shape.id)
		.query(async (opts): Promise<ListCustomer> => {
			const found = await selectListCustomer(opts.input, opts.ctx.role.organization.id);
			if (!found) throw new TRPCError({ code: "NOT_FOUND" });
			return found;
		}),

	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(customerUpdateMutationInputSchema)
		.mutation(async (opts): Promise<ListCustomer> => {
			if (!hasPermission(RolePermissions.CUSTOMER_UPDATE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });

			return db.transaction(async (tx) => {
				const found = await selectListCustomer(opts.input.id, opts.ctx.role.organization.id, tx);
				if (!found) throw new TRPCError({ code: "NOT_FOUND" });

				const updated = (
					await tx
						.update(customer)
						.set({ ...opts.input, id: undefined })
						.where(eq(customer.id, found.customer.id))
						.returning()
				).at(0);
				if (!updated) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
				return {
					customer: updated,
					project: found.project,
					testimonial_count: found.testimonial_count,
				} satisfies ListCustomer;
			});
		}),
	create: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(customerInsertModelSchema)
		.mutation(async (opts): Promise<ListCustomer> => {
			if (!hasPermission(RolePermissions.CUSTOMER_CREATE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });
			return db.transaction(async (tx) => {
				const foundProject = await tx.query.project.findFirst({
					where: and(eq(project.id, opts.input.project_id), eq(project.organization_id, opts.ctx.role.organization.id)),
				});
				if (!foundProject) throw new TRPCError({ code: "NOT_FOUND" });
				const created = (await tx.insert(customer).values(opts.input).returning()).at(0);
				if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
				return { customer: created, project: foundProject, testimonial_count: 0 } satisfies ListCustomer;
			});
		}),

	delete: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(customerSelectModelSchema.shape.id)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.CUSTOMER_DELETE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });
			await db.transaction(async (tx) => {
				const found = await selectCustomer(opts.input, opts.ctx.role.organization.id, tx);
				if (!found) throw new TRPCError({ code: "NOT_FOUND" });
				await tx.delete(customer).where(eq(customer.id, found.customer.id));
			});
		}),
});
