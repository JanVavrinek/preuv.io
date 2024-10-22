import type { z } from "zod";
import type { organizationCreateMutationInputSchema } from "./schemas";

export type OrganizationCreateMutationInput = z.infer<
	typeof organizationCreateMutationInputSchema
>;
