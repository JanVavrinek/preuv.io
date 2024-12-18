import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/lib/db/schemas",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.VITE_DB_URL ?? "",
	},
});
