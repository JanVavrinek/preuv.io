import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { enumToPgEnum } from "../utils";
import { project } from "./project";
import { testimonial } from "./testimonial";

export enum WidgetType {
	SIMPLE = "simple",
	COMMENTS = "comments",
}

export const widgetTypes = t.pgEnum("widget_type", enumToPgEnum(WidgetType));

export const widget = t.pgTable("widgets", {
	id: t.uuid().defaultRandom().primaryKey(),
	name: t.text().notNull(),
	project_id: t
		.uuid()
		.references(() => project.id, { onDelete: "cascade" })
		.notNull(),
	created_at: t.timestamp().defaultNow().notNull(),
	type: widgetTypes().notNull(),
	options: t.json().notNull().default({}),
});

export type WidgetSelectModel = InferSelectModel<typeof widget>;
export type WidgetInsertModel = InferInsertModel<typeof widget>;

export const widgetSelectModelSchema = createSelectSchema(widget).extend({
	name: z.string().min(3),
	options: z.unknown(),
});
export const widgetInsertModelSchema = createInsertSchema(widget).extend({
	name: z.string().min(3),
	options: z.unknown(),
});

export const widgetRelations = relations(widget, ({ one, many }) => ({
	project: one(project, { fields: [widget.project_id], references: [project.id] }),
	testimonials: many(testimonial),
}));

export const widgetSimpleTypeOptionsSchema = z.object({
	accent: z.string().regex(new RegExp(/^#([0-9a-f]{3}){1,2}$/i), "invalid-color"),
	userIcon: z.object({
		show: z.boolean(),
		radius: z.number().int().nonnegative().max(100),
	}),
});

export const widgetCommentsTypeOptionsSchema = z.object({
	accent: z.string().regex(new RegExp(/^#([0-9a-f]{3}){1,2}$/i), "invalid-color"),
	radius: z.number().int().nonnegative().max(20),
});

export const widgetOptionsSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal(WidgetType.SIMPLE),
		options: widgetSimpleTypeOptionsSchema,
	}),
	z.object({
		type: z.literal(WidgetType.COMMENTS),
		options: widgetSimpleTypeOptionsSchema,
	}),
]);
