import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { project } from "./project";
import { testimonial } from "./testimonial";

export const widget = t.pgTable("widgets", {
	id: t.uuid().defaultRandom().primaryKey(),
	name: t.text().notNull(),
	project_id: t
		.uuid()
		.references(() => project.id, { onDelete: "cascade" })
		.notNull(),
	created_at: t.timestamp().defaultNow().notNull(),
	type: t.text().notNull(),
	options: t.json().notNull().default({}),
});

export type WidgetSelectModel = InferSelectModel<typeof widget>;
export type WidgetInsertModel = InferInsertModel<typeof widget>;

export const widgetSelectModelSchema = createSelectSchema(widget).extend({
	name: z.string().min(3),
});
export const widgetInsertModelSchema = createInsertSchema(widget).extend({
	name: z.string().min(3),
});

export const widgetRelations = relations(widget, ({ one, many }) => ({
	project: one(project, { fields: [widget.project_id], references: [project.id] }),
	testimonials: many(testimonial),
}));
