import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { project } from "./project";
import { testimonial } from "./testimonial";

export const form = t.pgTable("forms", {
	id: t.uuid().defaultRandom().primaryKey(),
	slug: t.text().notNull(),
	welcome: t.text().notNull(),
	thankyou: t.text().notNull(),
	active: t.boolean().notNull().default(false),
	project_id: t
		.uuid()
		.references(() => project.id, { onDelete: "cascade" })
		.notNull(),
	created_at: t.timestamp().defaultNow().notNull(),
});

export type FormSelectModel = InferSelectModel<typeof form>;
export type FormInsertModel = InferInsertModel<typeof form>;

export const formSelectModelSchema = createSelectSchema(form);
export const formInsertModelSchema = createInsertSchema(form);

export const formRelations = relations(form, ({ one, many }) => ({
	project: one(project, {
		references: [project.id],
		fields: [form.project_id],
	}),
	testimonials: many(testimonial),
}));
