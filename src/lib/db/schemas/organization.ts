import * as t from "drizzle-orm/pg-core";

export const organization = t.pgTable("organizations", {
	id: t.uuid().unique().primaryKey().defaultRandom(),
	name: t.text().notNull(),
	created_at: t.timestamp().defaultNow(),
});
