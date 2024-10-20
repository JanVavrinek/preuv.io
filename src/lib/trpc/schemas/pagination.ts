import { z } from "zod";

export const paginationSchema = z.object({
	offset: z.number().int().nonnegative().default(0),
	limit: z.number().int().positive().max(100).default(20),
});
