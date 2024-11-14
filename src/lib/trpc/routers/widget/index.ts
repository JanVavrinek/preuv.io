import { db } from "@lib/db";
import { selectListWidget, selectWidget } from "@lib/db/queries/widget";
import { type ProjectSelectModel, project } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import { widget, widgetOptionsSchema, widgetSelectModelSchema } from "@lib/db/schemas/widget";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import type { Collection } from "@lib/trpc/types";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, count, desc, eq } from "drizzle-orm";
import testimonials from "./routers/testimonials";
import {
	widgetCreateMutationInputSchema,
	widgetGetManyQueryInputSchema,
	widgetUpdateMutationInputSchema,
} from "./schemas";
import type { ListWidget } from "./types";

export default router({
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(widgetGetManyQueryInputSchema)
		.query(async (opts): Promise<Collection<ListWidget>> => {
			const [widgets, total] = await Promise.all([
				db
					.select({ widget, project })
					.from(widget)
					.innerJoin(project, eq(widget.project_id, project.id))
					.where(
						and(
							eq(project.organization_id, opts.ctx.role.organization.id),
							opts.input.project ? eq(project.id, opts.input.project) : undefined,
						),
					)
					.offset(opts.input.offset)
					.limit(opts.input.limit)
					.orderBy(desc(widget.created_at)),
				db
					.select({ count: count() })
					.from(widget)
					.innerJoin(project, eq(widget.project_id, project.id))
					.where(
						and(
							eq(project.organization_id, opts.ctx.role.organization.id),
							opts.input.project ? eq(project.id, opts.input.project) : undefined,
						),
					),
			]);
			return { items: widgets, total: total.at(0)?.count ?? 0 };
		}),
	getOne: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(widgetSelectModelSchema.shape.id)
		.query(async (opts): Promise<ListWidget> => {
			const found = await selectListWidget(opts.input, opts.ctx.role.organization.id);
			if (!found) throw new TRPCError({ code: "NOT_FOUND" });
			return found;
		}),

	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(widgetUpdateMutationInputSchema)
		.mutation(async (opts): Promise<ListWidget> => {
			if (!hasPermission(RolePermissions.WIDGET_UPDATE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });
			return await db.transaction(async (tx): Promise<ListWidget> => {
				const foundWidget = await selectListWidget(opts.input.id, opts.ctx.role.organization.id, tx);
				if (!foundWidget) throw new TRPCError({ code: "NOT_FOUND" });

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

				if (opts.input.data.options) {
					const parse = widgetOptionsSchema.safeParse({
						type: opts.input.data.type ?? foundWidget.widget.type,
						options: opts.input.data.options,
					});
					if (parse.error) throw new TRPCError({ code: "BAD_REQUEST" });
					opts.input.data.options = parse.data.options;
				}

				const updated = (
					await tx.update(widget).set(opts.input.data).where(eq(widget.id, foundWidget.widget.id)).returning()
				).at(0);

				if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
				return {
					project: foundProject ?? foundWidget.project,
					widget: updated,
				};
			});
		}),
	delete: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(widgetSelectModelSchema.shape.id)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.WIDGET_DELETE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });
			await db.transaction(async (tx) => {
				const found = await selectWidget(opts.input, opts.ctx.role.organization.id, tx);
				if (!found) throw new TRPCError({ code: "NOT_FOUND" });
				await tx.delete(widget).where(eq(widget.id, found.widget.id));
			});
		}),
	create: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(widgetCreateMutationInputSchema)
		.mutation(async (opts): Promise<ListWidget> => {
			if (!hasPermission(RolePermissions.WIDGET_CREATE, opts.ctx.role.role)) throw new TRPCError({ code: "FORBIDDEN" });
			return await db.transaction(async (tx) => {
				const parse = widgetOptionsSchema.safeParse({
					type: opts.input.type,
					options: opts.input.options,
				});
				if (parse.error) throw new TRPCError({ code: "BAD_REQUEST" });
				opts.input.options = parse.data.options;

				const foundProject = await tx.query.project.findFirst({
					where: and(eq(project.id, opts.input.project_id), eq(project.organization_id, opts.ctx.role.organization.id)),
				});
				if (!foundProject) throw new TRPCError({ code: "NOT_FOUND" });
				const created = (await tx.insert(widget).values(opts.input).returning()).at(0);
				if (!created) throw new TRPCError({ code: "NOT_FOUND" });
				return {
					project: foundProject,
					widget: created,
				};
			});
		}),
	testimonials,
});
