import { db } from "@lib/db";
import { type UserSelectModel, user } from "@lib/db/schemas/user";
import { isAuthorized } from "@lib/trpc/middlewares";
import { getCurrentUser } from "@lib/trpc/middlewares/currentUser";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { procedure, router } from "../../init";
import { userUpdateMutationInputSchema } from "./schemas";

export default router({
	getCurrent: procedure
		.use(isAuthorized)
		.use(getCurrentUser)
		.query(async (opts): Promise<UserSelectModel> => opts.ctx.currentUser),
	createCurrent: procedure.use(isAuthorized).mutation(async (opts): Promise<UserSelectModel> => {
		const foundUser = (await db.select().from(user).where(eq(user.id, opts.ctx.user.sub))).at(0);
		if (foundUser) return foundUser;
		const createdUser = (
			await db
				.insert(user)
				.values({
					id: opts.ctx.user.sub,
					name: opts.ctx.user.email.split("@")[0],
				})
				.returning()
		).at(0);
		if (!createdUser) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
		return createdUser;
	}),
	updateCurrent: procedure
		.input(userUpdateMutationInputSchema)
		.use(isAuthorized)
		.mutation(async (opts): Promise<UserSelectModel | undefined> => {
			return (
				await db.update(user).set({ name: opts.input.name }).where(eq(user.id, opts.ctx.user.sub)).returning()
			).at(0);
		}),
});
