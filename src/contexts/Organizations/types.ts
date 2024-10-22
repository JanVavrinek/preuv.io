import type { AppRouter } from "@lib/trpc/router";

export type Organization = NonNullable<
	Awaited<ReturnType<AppRouter["organization"]["getOne"]>>
>["organization"];

export type Role = NonNullable<
	Awaited<ReturnType<AppRouter["organization"]["getOne"]>>
>["role"];
