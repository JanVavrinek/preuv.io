import createCaller from "@lib/trpc/caller";
import { TRPCError } from "@trpc/server";
import { describe, expect, test } from "vitest";

describe("user router", () => {
	test("getCurrent query", async () => {
		const caller = createCaller({
			event: undefined as never,
			organizationId: null,
		});

		await expect(caller.user.getCurrent).rejects.toThrow(TRPCError);
	});
});
