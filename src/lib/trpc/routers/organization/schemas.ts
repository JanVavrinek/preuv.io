import { organizationInsertModelSchema } from "@lib/db/schemas/organization";
import { roleInsertModelSchema } from "@lib/db/schemas/role";
import { z } from "zod";

export const organizationCreateMutationInputSchema = z.object({
	organizationName: organizationInsertModelSchema.shape.name,
	ownerRoleName: roleInsertModelSchema.shape.name,
});
