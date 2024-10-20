import { router } from "./init";
import organization from "./routers/organization";
import user from "./routers/user";

export const appRouter = router({
	user,
	organization,
});

export type AppRouter = typeof appRouter;
