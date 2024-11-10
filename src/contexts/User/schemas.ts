import { z } from "zod";

export const userSchema = z.object({
	id: z.string().uuid().readonly(),
	name: z.string().min(3),
});
