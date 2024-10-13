import { procedure, router } from "../../init";
import { isAuthorized } from "../../middlewares/auth";

export default router({
	getTest: procedure.use(isAuthorized).query(async (opts) => {
		return opts.ctx.user.payload;
	}),
});
