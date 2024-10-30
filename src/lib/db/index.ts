import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { customerRelations } from "./schemas/customer";
import { invite } from "./schemas/invite";
import { member } from "./schemas/member";
import { organization } from "./schemas/organization";
import { project, projectRelations } from "./schemas/project";
import { role } from "./schemas/role";
import { testimonial, testimonialRelations } from "./schemas/testimonial";
import { user } from "./schemas/user";

const client = postgres(import.meta.env.VITE_DB_URL, { prepare: false });

export const db = drizzle(client, {
	schema: {
		role,
		organization,
		member,
		user,
		invite,
		project,
		projectRelations,
		testimonial,
		testimonialRelations,
		customerRelations,
	},
});
