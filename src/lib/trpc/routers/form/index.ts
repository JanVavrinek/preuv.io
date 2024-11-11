import { db } from "@lib/db";
import { form } from "@lib/db/schemas/form";
import { formVisit } from "@lib/db/schemas/formVisit";
import { project } from "@lib/db/schemas/project";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import type { Collection } from "@lib/trpc/types";
import { and, count, desc, eq, sql, sum } from "drizzle-orm";
import { formGetManyQueryInputSchema } from "./schemas";
import type { ListForm } from "./types";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(formGetManyQueryInputSchema)
		.query(async (opts): Promise<Collection<ListForm>> => {
			const [items, total] = await Promise.all([
				db
					.select({
						form,
						project,
						total_visits: sql`COALESCE(${sum(formVisit.visits)}, 0)`.mapWith(Number),
						unique_visits: count(formVisit.id),
					})
					.from(form)
					.innerJoin(project, eq(form.project_id, project.id))
					.leftJoin(formVisit, eq(formVisit.form_id, form.id))
					.where(
						and(
							eq(project.organization_id, opts.ctx.role.organization.id),
							opts.input.project ? eq(form.project_id, opts.input.project) : undefined,
						),
					)
					.groupBy(form.id, project.id)
					.offset(opts.input.offset)
					.limit(opts.input.limit)
					.orderBy(desc(form.created_at)),
				db
					.select({ count: count() })
					.from(form)
					.innerJoin(project, eq(form.project_id, project.id))
					.where(eq(project.organization_id, opts.ctx.role.organization.id)),
			]);

			return { items, total: total.at(0)?.count ?? 0 };
		}),
});
