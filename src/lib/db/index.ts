import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { invite } from "./schemas/invite";
import { member } from "./schemas/member";
import { organization } from "./schemas/organization";
import { project } from "./schemas/project";
import { role } from "./schemas/role";
import { user } from "./schemas/user";

const client = postgres(import.meta.env.VITE_DB_URL, { prepare: false });

export const db = drizzle(client, {
	schema: { role, organization, member, user, invite, project },
});
