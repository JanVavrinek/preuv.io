import { db } from "@lib/db";
import { user as userTable } from "@lib/db/schemas/user";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { middleware } from "../init";

export const getCurrentUser = middleware(async (opts) => {
	if (!opts.ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
	const currentUser = (
		await db.select().from(userTable).where(eq(userTable.id, opts.ctx.user.sub))
	).at(0);
	if (!currentUser) throw new TRPCError({ code: "UNAUTHORIZED" });
	return opts.next({
		ctx: {
			...opts.ctx,
			currentUser,
		},
	});
});
