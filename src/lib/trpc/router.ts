import { router } from "./init";
import organization from "./routers/organization";
import role from "./routers/role";
import user from "./routers/user";

export const appRouter = router({
	user,
	organization,
	role,
});

export type AppRouter = typeof appRouter;
