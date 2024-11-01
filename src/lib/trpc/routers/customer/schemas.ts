import { customerInsertModelSchema } from "@lib/db/schemas/customer";

export const customerUpdateMutationInputSchema = customerInsertModelSchema.omit({ created_at: true });
