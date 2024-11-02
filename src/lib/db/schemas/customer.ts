import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { project } from "./project";
import { testimonial } from "./testimonial";

export const customer = t.pgTable("customers", {
	id: t.uuid().defaultRandom().primaryKey(),
	name: t.text().notNull(),
	title: t.text(),
	company: t.text(),
	url: t.text(),
	project_id: t
		.uuid()
		.references(() => project.id, { onDelete: "cascade" })
		.notNull(),
	created_at: t.timestamp().defaultNow().notNull(),
});

export type CustomerSelectModel = InferSelectModel<typeof customer>;
export type CustomerInsertModel = InferInsertModel<typeof customer>;

export const customerSelectModelSchema = createSelectSchema(customer).extend({
	name: z.string().min(3),
});
export const customerInsertModelSchema = createInsertSchema(customer).extend({
	name: z.string().min(3),
});

export const customerRelations = relations(customer, ({ many, one }) => ({
	testimonials: many(testimonial),
	project: one(project),
}));
