import { db } from "@lib/db";
import { selectForm, selectListForm } from "@lib/db/queries/form";
import { form, formSelectModelSchema } from "@lib/db/schemas/form";
import { formVisit } from "@lib/db/schemas/formVisit";
import { type ProjectSelectModel, project } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import type { Collection } from "@lib/trpc/types";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, count, desc, eq, sql, sum } from "drizzle-orm";
import { formGetManyQueryInputSchema, formUpdateMutationInputSchema } from "./schemas";
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
	getOne: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(formSelectModelSchema.shape.id)
		.query(async (opts) => {
			const found = await selectListForm(opts.input, opts.ctx.role.organization.id);
			if (!found) throw new TRPCError({ code: "NOT_FOUND" });
			return found;
		}),

	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(formUpdateMutationInputSchema)
		.mutation(async (opts): Promise<ListForm> => {
			if (!hasPermission(RolePermissions.FORM_UPDATE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });
			return db.transaction(async (tx): Promise<ListForm> => {
				const foundForm = await selectListForm(opts.input.id, opts.ctx.role.organization.id, tx);
				if (!foundForm) throw new TRPCError({ code: "NOT_FOUND" });

				let foundProject: ProjectSelectModel | undefined;

				if (opts.input.data.project_id) {
					foundProject = await tx.query.project.findFirst({
						where: and(
							eq(project.id, opts.input.data.project_id),
							eq(project.organization_id, opts.ctx.role.organization.id),
						),
					});
					if (!foundProject)
						throw new TRPCError({
							code: "NOT_FOUND",
						});
				}

				const updated = (
					await tx.update(form).set(opts.input.data).where(eq(form.id, foundForm.form.id)).returning()
				).at(0);

				if (!updated) throw new TRPCError({ code: "NOT_FOUND" });

				return {
					form: updated,
					project: foundProject ?? foundForm.project,
					total_visits: foundForm.total_visits,
					unique_visits: foundForm.unique_visits,
				};
			});
		}),

	delete: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(formSelectModelSchema.shape.id)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.FORM_DELETE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });
			await db.transaction(async (tx) => {
				const found = await selectForm(opts.input, opts.ctx.role.organization.id, tx);
				if (!found) throw new TRPCError({ code: "NOT_FOUND" });
				await tx.delete(form).where(eq(form.id, found.form.id));
			});
		}),
});
