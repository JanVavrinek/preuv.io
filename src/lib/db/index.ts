import { drizzle } from "drizzle-orm/postgres-js";
import { member } from "./schemas/member";
import { organization } from "./schemas/organization";
import { role } from "./schemas/role";
import { user } from "./schemas/user";
export const db = drizzle(import.meta.env.VITE_DB_URL, {
	schema: { role, organization, member, user },
});
