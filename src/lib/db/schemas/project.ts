import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { customer } from "./customer";
import { organization } from "./organization";
import { testimonial } from "./testimonial";

export const project = t.pgTable("projects", {
	id: t.uuid().defaultRandom().primaryKey(),
	name: t.text().notNull(),
	organization_id: t
		.uuid()
		.references(() => organization.id, { onDelete: "cascade" })
		.notNull(),
	created_at: t.timestamp().defaultNow().notNull(),
	image: t.text(),
});

export type ProjectSelectModel = InferSelectModel<typeof project>;
export type ProjectInsertModel = InferInsertModel<typeof project>;

export const projectSelectModelSchema = createSelectSchema(project).extend({
	name: z.string().min(3).max(255),
});
export const projectInsertModelSchema = createInsertSchema(project).extend({
	name: z.string().min(3).max(255),
});

export const projectRelations = relations(project, ({ many }) => ({
	customers: many(customer),
	testimonials: many(testimonial),
}));
