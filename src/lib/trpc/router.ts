import { router } from "./init";
import customer from "./routers/customer";
import form from "./routers/form";
import invite from "./routers/invite";
import member from "./routers/member";
import organization from "./routers/organization";
import project from "./routers/project";
import role from "./routers/role";
import testimonial from "./routers/testimonial";
import user from "./routers/user";
import widget from "./routers/widget";

export const appRouter = router({
	user,
	organization,
	role,
	member,
	invite,
	project,
	customer,
	testimonial,
	form,
	widget,
});

export type AppRouter = typeof appRouter;
