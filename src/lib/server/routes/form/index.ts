import { db } from "@lib/db";
import { customer, customerInsertModelSchema } from "@lib/db/schemas/customer";
import { form, formSelectModelSchema } from "@lib/db/schemas/form";
import { formVisit } from "@lib/db/schemas/formVisit";
import { testimonial, testimonialInsertModelSchema } from "@lib/db/schemas/testimonial";
import { action, query, redirect } from "@solidjs/router";
import { and, eq } from "drizzle-orm";
import { getRequestEvent } from "solid-js/web";
import { z } from "zod";

export const getForm = query(async (slug: string) => {
	"use server";
	const foundForm = await db.query.form.findFirst({
		where: eq(form.slug, slug),
		with: {
			project: {
				columns: {
					name: true,
				},
			},
		},
	});
	if (!foundForm) throw redirect("/404");

	const event = getRequestEvent();

	const visit = await db.query.formVisit.findFirst({
		where: and(eq(formVisit.form_id, foundForm.id), eq(formVisit.ip, event?.clientAddress ?? "")),
	});
	if (!visit) {
		db.insert(formVisit).values({
			form_id: foundForm.id,
			ip: event?.clientAddress ?? "",
		});
	} else {
		db.update(formVisit)
			.set({
				visits: visit.visits + 1,
				last_visit_at: new Date(),
			})
			.where(eq(formVisit.id, visit.id))
			.execute();
	}
	if (!foundForm.active) throw redirect("/form/paused");
	return { thankyou: foundForm.thankyou, welcome: foundForm.welcome, project: foundForm.project.name };
}, "form");

export const formSubmitActionSchema = z.object({
	form: formSelectModelSchema.shape.slug,
	data: z.object({
		customer: z.object({
			email: customerInsertModelSchema.shape.email,
			name: customerInsertModelSchema.shape.name,
			company: customerInsertModelSchema.shape.company,
			title: customerInsertModelSchema.shape.title,
			url: customerInsertModelSchema.shape.url,
		}),
		testimonial: z.object({
			text: testimonialInsertModelSchema.shape.text,
			rating: testimonialInsertModelSchema.shape.rating,
		}),
	}),
});

export const submitFormAction = action(async (data: z.infer<typeof formSubmitActionSchema>) => {
	"use server";
	const parse = formSubmitActionSchema.parse(data);
	try {
		await db.transaction(async (tx) => {
			const found = await tx.query.form.findFirst({
				where: eq(form.slug, parse.form),
				with: {
					project: {
						columns: {
							organization_id: true,
						},
					},
				},
			});
			if (!found) throw redirect("/404");
			if (!found.active) throw redirect("/form/paused");
			const customerWhere = and(
				eq(customer.name, parse.data.customer.name),
				eq(customer.email, parse.data.customer.email),
			);

			let customerFound = await tx.query.customer.findFirst({
				where: customerWhere,
			});
			if (customerFound)
				tx.update(customer)
					.set({ ...parse.data.customer })
					.where(customerWhere);
			else
				customerFound = (
					await tx
						.insert(customer)
						.values({ ...parse.data.customer, project_id: found.project_id })
						.returning()
				).at(0);

			if (!customerFound) throw new Error("customer-not-found");

			await tx.insert(testimonial).values({
				customer_id: customerFound.id,
				project_id: found.project_id,
				text: parse.data.testimonial.text,
				rating: parse.data.testimonial.rating,
				form_id: found.id,
			});
		});
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch {
		return new Response(JSON.stringify({ success: false }), { status: 500 });
	}
});
