import { db } from "@lib/db";
import { member } from "@lib/db/schemas/member";
import { type UserSelectModel, user } from "@lib/db/schemas/user";
import createCaller from "@lib/trpc/caller";
import type { Context } from "@lib/trpc/context";
import { TRPCError } from "@trpc/server";
import { inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

const OWNER_USER = {
	email: "tes1t@preuv.io",
	id: "fa01149b-dc4b-460b-a0f6-e25fc0d725a1",
	name: "test1",
} satisfies UserSelectModel;

const INVITED_USER = {
	email: "test2@preuv.io",
	id: "fa01149b-dc4b-460b-a0f6-e25fc0d725a2",
	name: "test2",
} satisfies UserSelectModel;

const USER = {
	email: "test3@preuv.io",
	id: "fa01149b-dc4b-460b-a0f6-e25fc0d725a3",
	name: "test3",
} satisfies UserSelectModel;

const OWNER_LOGGED_USER_DATA: Context["user"] = {
	email: OWNER_USER.email,
	role: "authenticated",
	sub: OWNER_USER.id,
};

const INVITED_LOGGED_USER_DATA: Context["user"] = {
	email: INVITED_USER.email,
	role: "authenticated",
	sub: INVITED_USER.id,
};

const LOGGED_USER_DATA: Context["user"] = {
	email: USER.email,
	role: "authenticated",
	sub: USER.id,
};

beforeAll(async () => {
	await db.delete(user).where(inArray(user.id, [OWNER_USER.id, USER.id, INVITED_USER.id]));
	await db.insert(user).values([OWNER_USER, USER, INVITED_USER]);
});

describe.sequential("organization router", () => {
	let organizationId: string | null = null;
	let ownerRoleId: number | undefined = undefined;
	let memberRoleId: number | undefined = undefined;

	test("create mutation", async () => {
		let caller = createCaller({
			event: undefined as never,
			organizationId: null,
			user: OWNER_LOGGED_USER_DATA,
		});
		const organizationName = "org_name";
		const ownerRoleName = "owner";
		const res = await caller.organization.create({ organizationName, ownerRoleName });
		organizationId = res.organization.id;
		ownerRoleId = res.role.id;

		expect(res.organization.name).equal(organizationName);
		expect(res.role.organization_id).equal(res.organization.id);
		expect(res.role.name).equal(ownerRoleName);
		expect(res.role.owner).toBeTruthy();

		caller = createCaller({
			event: undefined as never,
			organizationId,
			user: OWNER_LOGGED_USER_DATA,
		});

		const memberRole = await caller.role.create({ name: "member", permissions: [] });
		memberRoleId = memberRole.id;
		await db.insert(member).values({ user_id: INVITED_USER.id, role_id: memberRole.id }).execute();
	});

	test("getOne query", async () => {
		if (!organizationId) throw new Error("No organization id");
		const ownerCaller = createCaller({
			event: undefined as never,
			organizationId,
			user: OWNER_LOGGED_USER_DATA,
		});
		const invitedCaller = createCaller({
			event: undefined as never,
			organizationId,
			user: INVITED_LOGGED_USER_DATA,
		});
		const caller = createCaller({
			event: undefined as never,
			organizationId,
			user: LOGGED_USER_DATA,
		});
		await expect(ownerCaller.organization.getOne(organizationId)).resolves.toMatchObject({
			organization: {
				id: organizationId,
			},
			role: { id: ownerRoleId },
		});
		await expect(invitedCaller.organization.getOne(organizationId)).resolves.toMatchObject({
			organization: {
				id: organizationId,
			},
			role: { id: memberRoleId },
		});
		await expect(caller.organization.getOne(organizationId)).rejects.toThrow(TRPCError);
	});

	test("getMany query", async () => {
		const ownerCaller = createCaller({
			event: undefined as never,
			organizationId,
			user: OWNER_LOGGED_USER_DATA,
		});
		const invitedCaller = createCaller({
			event: undefined as never,
			organizationId,
			user: INVITED_LOGGED_USER_DATA,
		});
		const caller = createCaller({
			event: undefined as never,
			organizationId,
			user: LOGGED_USER_DATA,
		});

		await expect(ownerCaller.organization.getMany({})).resolves.toHaveLength(1);
		await expect(invitedCaller.organization.getMany({})).resolves.toHaveLength(1);
		await expect(caller.organization.getMany({})).resolves.toHaveLength(0);
	});

	test("update mutation", async () => {
		const ownerCaller = createCaller({
			event: undefined as never,
			organizationId,
			user: OWNER_LOGGED_USER_DATA,
		});
		const invitedCaller = createCaller({
			event: undefined as never,
			organizationId,
			user: INVITED_LOGGED_USER_DATA,
		});
		const caller = createCaller({
			event: undefined as never,
			organizationId,
			user: LOGGED_USER_DATA,
		});

		const newName = "new_org_name_update";
		await expect(ownerCaller.organization.update({ name: newName })).resolves.toMatchObject({
			name: newName,
			id: organizationId,
		});

		await expect(invitedCaller.organization.update({ name: newName })).rejects.toThrow(TRPCError);
		await expect(caller.organization.update({ name: newName })).rejects.toThrow(TRPCError);
	});
});

afterAll(async () => {
	await db.delete(user).where(inArray(user.id, [OWNER_USER.id, USER.id, INVITED_USER.id]));
});
