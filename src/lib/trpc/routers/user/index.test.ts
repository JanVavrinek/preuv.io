import { db } from "@lib/db";
import { type UserSelectModel, user } from "@lib/db/schemas/user";
import createCaller from "@lib/trpc/caller";
import type { Context } from "@lib/trpc/context";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

const USER = {
	email: "test@preuv.io",
	id: "fa01149b-dc4b-460b-a0f6-e25fc0d725c1",
	name: "test",
} satisfies UserSelectModel;

const LOGGED_USER_DATA: Context["user"] = {
	email: USER.email,
	role: "authenticated",
	sub: USER.id,
};

beforeAll(async () => {
	await db.delete(user).where(eq(user.id, USER.id));
});

describe.sequential("user router", () => {
	test("createCurrent mutation", async () => {
		const caller = createCaller({
			event: undefined as never,
			organizationId: null,
			user: LOGGED_USER_DATA,
		});

		await expect(caller.user.createCurrent()).resolves.toHaveProperty("id", USER.id);
	});
	test("getCurrent query", async () => {
		const caller = createCaller({
			event: undefined as never,
			organizationId: null,
		});

		await expect(caller.user.getCurrent()).rejects.toThrow(TRPCError);

		const callerLogged = createCaller({
			event: undefined as never,
			organizationId: null,
			user: LOGGED_USER_DATA,
		});
		await expect(callerLogged.user.getCurrent()).resolves.toHaveProperty("id", USER.id);
	});

	test("updateCurrent mutation", async () => {
		const caller = createCaller({
			event: undefined as never,
			organizationId: null,
			user: LOGGED_USER_DATA,
		});

		const name = "new_name";
		await expect(caller.user.updateCurrent({ name })).resolves.toHaveProperty("name", name);
		await expect(caller.user.updateCurrent({ name: "" })).rejects.toThrow(TRPCError);
	});
});

afterAll(async () => {
	await db.delete(user).where(eq(user.id, USER.id));
});
