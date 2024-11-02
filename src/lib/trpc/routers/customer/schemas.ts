import { customerInsertModelSchema, customerSelectModelSchema } from "@lib/db/schemas/customer";

export const customerUpdateMutationInputSchema = customerSelectModelSchema.omit({ created_at: true });
export const customerCreateMutationInputSchema = customerInsertModelSchema.omit({ created_at: true, id: true });
