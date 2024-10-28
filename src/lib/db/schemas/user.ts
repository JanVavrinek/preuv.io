import type { InferSelectModel } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const user = t.pgTable("users", {
	id: t.uuid().primaryKey(),
	name: t.text().notNull(),
	email: t.text().notNull().unique(),
});

export type UserSelectModel = InferSelectModel<typeof user>;

export const userSelectModelSchema = createSelectSchema(user);
export const userInsertModelSchema = createInsertSchema(user);
