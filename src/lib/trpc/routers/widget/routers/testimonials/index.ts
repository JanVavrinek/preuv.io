import { db } from "@lib/db";
import { customer } from "@lib/db/schemas/customer";
import { project } from "@lib/db/schemas/project";
import { testimonial } from "@lib/db/schemas/testimonial";
import { widget, widgetSelectModelSchema } from "@lib/db/schemas/widget";
import { widgetTestimonial } from "@lib/db/schemas/widgetTestimonials";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";
import { and, eq } from "drizzle-orm";

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
});
