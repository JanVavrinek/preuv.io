import { drizzle } from "drizzle-orm/connect";
export const db = await drizzle("postgres-js", import.meta.env.VITE_DB_URL);
