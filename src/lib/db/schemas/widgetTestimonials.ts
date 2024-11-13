import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { testimonial } from "./testimonial";
import { widget } from "./widget";

export const widgetTestimonial = t.pgTable(
	"widget_testimonials",
	{
		widget_id: t
			.uuid()
			.references(() => widget.id, { onDelete: "cascade" })
			.notNull(),
		testimonial_id: t
			.uuid()
			.references(() => testimonial.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => {
		return {
			pk: t.primaryKey({ columns: [table.widget_id, table.testimonial_id] }),
		};
	},
);

export type WidgetTestimonialSelectModel = InferSelectModel<typeof widgetTestimonial>;
export type WidgetTestimonialInsertModel = InferInsertModel<typeof widgetTestimonial>;

export const widgetTestimonialSelectModelSchema = createSelectSchema(widgetTestimonial);
export const widgetTestimonialInsertModelSchema = createInsertSchema(widgetTestimonial);

export const widgetTestimonialRelations = relations(widgetTestimonial, ({ one }) => ({
	widget: one(widget, { fields: [widgetTestimonial.widget_id], references: [widget.id] }),
	testimonial: one(testimonial, { fields: [widgetTestimonial.testimonial_id], references: [testimonial.id] }),
}));
