import { router } from "./init";
import member from "./routers/member";
import organization from "./routers/organization";
import role from "./routers/role";
import user from "./routers/user";

export const appRouter = router({
	user,
	organization,
	role,
	member,
});

export type AppRouter = typeof appRouter;
