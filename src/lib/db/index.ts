import { drizzle } from "drizzle-orm/postgres-js";
export const db = drizzle(import.meta.env.VITE_DB_URL);
