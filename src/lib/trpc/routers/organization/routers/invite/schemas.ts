import { roleSelectModelSchema } from "@lib/db/schemas/role";
import { z } from "zod";

export const organizationCreateInviteMutationSchema = z
	.object({
		email: z.string().email(),
		role: roleSelectModelSchema.shape.id,
	})
	.array()
	.min(1)
	.max(100);
