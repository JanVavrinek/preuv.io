import { db } from "@lib/db";
import { customer } from "@lib/db/schemas/customer";
import {} from "@lib/db/schemas/form";
import { testimonial } from "@lib/db/schemas/testimonial";
import { widget, widgetOptionsSchema } from "@lib/db/schemas/widget";
import { widgetTestimonial } from "@lib/db/schemas/widgetTestimonials";
import { query, redirect } from "@solidjs/router";
import { and, eq } from "drizzle-orm";

export const getWidget = query(async (widgetId: string) => {
	"use server";
	const foundWidget = await db.query.widget.findFirst({
		where: eq(widget.id, widgetId),
	});

	if (!foundWidget) throw redirect("/404");

	const testimonials = await db
		.select({
			testimonial: {
				text: testimonial.text,
				rating: testimonial.rating,
			},
			customer: {
				name: customer.name,
				email: customer.email,
				title: customer.title,
				company: customer.company,
				url: customer.url,
			},
		})
		.from(testimonial)
		.innerJoin(customer, eq(testimonial.customer_id, customer.id))
		.innerJoin(widgetTestimonial, eq(testimonial.id, widgetTestimonial.testimonial_id))
		.where(and(eq(widgetTestimonial.widget_id, foundWidget.id), eq(testimonial.approved, true)));

	const parse = widgetOptionsSchema.safeParse({
		type: foundWidget.type,
		options: foundWidget.options,
	});
	if (parse.error) throw redirect("/404");

	return {
		options: parse.data.options,
		type: foundWidget.type,
		testimonials,
	};
}, "widget");
