import type { z } from "zod";
import type { userUpdateMutationInputSchema } from "./schemas";

export type UserUpdateMutationInputSchema = z.infer<
	typeof userUpdateMutationInputSchema
>;
