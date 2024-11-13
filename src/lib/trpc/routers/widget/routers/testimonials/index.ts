import { db } from "@lib/db";
import { selectWidget } from "@lib/db/queries/widget";
import { customer } from "@lib/db/schemas/customer";
import { project } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import { testimonial } from "@lib/db/schemas/testimonial";
import { widget, widgetSelectModelSchema } from "@lib/db/schemas/widget";
import { widgetTestimonial } from "@lib/db/schemas/widgetTestimonials";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, eq, inArray } from "drizzle-orm";
import { widgetTestimonialUpdateMutationInputSchema } from "./schema";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(widgetSelectModelSchema.shape.id)
		.query(async (opts): Promise<ListTestimonial[]> => {
			return await db
				.select({ testimonial, project, customer })
				.from(testimonial)
				.innerJoin(widgetTestimonial, eq(testimonial.id, widgetTestimonial.testimonial_id))
				.innerJoin(widget, eq(widgetTestimonial.widget_id, widget.id))
				.innerJoin(project, eq(testimonial.project_id, project.id))
				.innerJoin(customer, eq(testimonial.customer_id, customer.id))
				.where(and(eq(widget.id, opts.input), eq(project.organization_id, opts.ctx.role.organization.id)));
		}),

	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(widgetTestimonialUpdateMutationInputSchema)
		.mutation(async (opts): Promise<ListTestimonial[]> => {
			if (!hasPermission(RolePermissions.WIDGET_UPDATE, opts.ctx.role.role))
				throw new TRPCError({ code: "UNAUTHORIZED" });
			return await db.transaction(async (tx) => {
				const foundWidget = await selectWidget(opts.input.id, opts.ctx.role.organization.id);
				if (!foundWidget) throw new TRPCError({ code: "NOT_FOUND" });
				const foundTestimonials = await tx
					.select({ testimonial, customer, project })
					.from(testimonial)
					.innerJoin(project, eq(testimonial.project_id, project.id))
					.innerJoin(customer, eq(testimonial.customer_id, customer.id))
					.where(
						and(
							inArray(testimonial.id, [...opts.input.testimonials]),
							eq(project.organization_id, opts.ctx.role.organization.id),
						),
					);
				if (foundTestimonials.length !== opts.input.testimonials.size) throw new TRPCError({ code: "BAD_REQUEST" });

				await tx.delete(widgetTestimonial).where(eq(widgetTestimonial.widget_id, opts.input.id));

				await tx
					.insert(widgetTestimonial)
					.values(foundTestimonials.map((t) => ({ testimonial_id: t.testimonial.id, widget_id: opts.input.id })));
				return foundTestimonials;
			});
		}),
});
