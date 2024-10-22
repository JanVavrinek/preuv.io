import { z } from "zod";

export const userUpdateMutationInputSchema = z.object({
	name: z.string().min(3),
});
