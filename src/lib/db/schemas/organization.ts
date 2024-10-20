import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const organization = t.pgTable("organizations", {
	id: t.uuid().unique().primaryKey().defaultRandom(),
	name: t.text().notNull(),
	created_at: t.timestamp().defaultNow().notNull(),
});

export type OrganizationSelectModel = InferSelectModel<typeof organization>;
export type OrganizationInsertModel = InferInsertModel<typeof organization>;

export const organizationSelectModelSchema = createSelectSchema(organization);
export const organizationInsertModelSchema = createInsertSchema(organization);
