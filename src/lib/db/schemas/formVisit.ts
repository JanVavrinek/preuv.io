import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { form } from "./form";

export const formVisit = t.pgTable("form_visits", {
	id: t.serial().primaryKey(),
	submitted: t.boolean().default(false).notNull(),
	visits: t.integer().default(1).notNull(),
	ip: t.text().notNull(),
	form_id: t
		.uuid()
		.references(() => form.id, { onDelete: "cascade" })
		.notNull(),
	first_visit_at: t.timestamp().defaultNow().notNull(),
	last_visit_at: t.timestamp().defaultNow().notNull(),
});

export type FormSelectModel = InferSelectModel<typeof formVisit>;
export type FormInsertModel = InferInsertModel<typeof formVisit>;

export const formSelectModelSchema = createSelectSchema(formVisit);
export const formInsertModelSchema = createInsertSchema(formVisit);

export const formVisitRelations = relations(formVisit, ({ one }) => ({
	form: one(form),
}));
