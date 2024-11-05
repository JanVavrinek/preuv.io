import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { customer } from "./customer";
import { project } from "./project";

export const testimonial = t.pgTable("testimonials", {
	id: t.uuid().defaultRandom().primaryKey(),
	text: t.text().notNull(),
	rating: t.smallint().default(0).notNull(),
	customer_id: t
		.uuid()
		.references(() => customer.id, { onDelete: "cascade" })
		.notNull(),
	project_id: t
		.uuid()
		.references(() => project.id, { onDelete: "cascade" })
		.notNull(),
	created_at: t.timestamp().defaultNow().notNull(),
	approved: t.boolean().default(false).notNull(),
});

export type TestimonialSelectModel = InferSelectModel<typeof testimonial>;
export type TestimonialInsertModel = InferInsertModel<typeof testimonial>;

export const testimonialInsertModelSchema = createInsertSchema(testimonial).extend({
	rating: z.number().int().min(1).max(5),
	text: z.string().min(3).max(1024),
});
export const testimonialSelectModelSchema = createSelectSchema(testimonial).extend({
	rating: z.number().int().min(1).max(5),
	text: z.string().min(3).max(1024),
});

export const testimonialRelations = relations(testimonial, ({ one }) => ({
	project: one(project),
	customer: one(customer),
}));
