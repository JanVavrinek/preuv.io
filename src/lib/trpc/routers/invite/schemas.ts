import { roleSelectModelSchema } from "@lib/db/schemas/role";
import { z } from "zod";

export const inviteCreateMutationSchema = z
	.object({
		email: z.string().email(),
		role: roleSelectModelSchema.shape.id,
	})
	.array()
	.min(1);
