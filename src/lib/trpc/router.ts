import { router } from "./init";
import invite from "./routers/invite";
import member from "./routers/member";
import organization from "./routers/organization";
import project from "./routers/project";
import role from "./routers/role";
import user from "./routers/user";

export const appRouter = router({
	user,
	organization,
	role,
	member,
	invite,
	project,
});

export type AppRouter = typeof appRouter;
