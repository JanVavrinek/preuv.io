import { db } from "@lib/db";
import {} from "@lib/db/schemas/organization";
import {
	type ProjectSelectModel,
	project,
	projectInsertModelSchema,
	projectSelectModelSchema,
} from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import { supabaseServiceClient } from "@lib/supabase/server";
import {
	StorageEntity,
	createSignedUploadUrl,
	createSignedUrl,
	storageObjectDelete,
	storageObjectInfo,
} from "@lib/supabase/storage";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas";
import type { Collection } from "@lib/trpc/types";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, asc, count, eq } from "drizzle-orm";
import { mapProjectsWithImages } from "./mappers";
import { updatePhotoMutationInputSchema } from "./schemas";

export default router({
	create: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(projectInsertModelSchema.shape.name)
		.mutation(async (opts): Promise<ProjectSelectModel | undefined> => {
			if (!hasPermission(RolePermissions.PROJECT_CREATE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });

			return (
				await db
					.insert(project)
					.values({ name: opts.input, organization_id: opts.ctx.role.organization.id })
					.returning()
			).at(0);
		}),
	photoUploadUrl: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(projectSelectModelSchema.shape.id)
		.query(async (opts) => {
			if (!hasPermission(RolePermissions.PROJECT_UPDATE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });

			const orgProject = await db.query.project.findFirst({
				where: and(eq(project.id, opts.input), eq(project.organization_id, opts.ctx.role.organization.id)),
			});
			if (!orgProject) throw new TRPCError({ code: "NOT_FOUND" });
			const id = crypto.randomUUID();
			const url = await createSignedUploadUrl(
				supabaseServiceClient,
				StorageEntity.PROJECT_COVER,
				`${orgProject.id}/${id}`,
			);
			return {
				url: url.data?.signedUrl,
				id,
			};
		}),
	updatePhoto: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(updatePhotoMutationInputSchema)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.PROJECT_UPDATE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });

			const orgProject = await db.query.project.findFirst({
				where: and(eq(project.id, opts.input.project), eq(project.organization_id, opts.ctx.role.organization.id)),
			});
			if (!orgProject) throw new TRPCError({ code: "NOT_FOUND" });

			const objectName = `${opts.input.project}/${opts.input.image}`;

			const exists = await storageObjectInfo(supabaseServiceClient, StorageEntity.PROJECT_COVER, objectName);
			if (!exists.data) throw new TRPCError({ code: "NOT_FOUND" });
			if (!exists.data.contentType?.startsWith("image/")) {
				storageObjectDelete(supabaseServiceClient, StorageEntity.PROJECT_COVER, [objectName]);
				throw new TRPCError({ code: "UNSUPPORTED_MEDIA_TYPE" });
			}
			await db.update(project).set({ image: opts.input.image });
			return createSignedUrl(supabaseServiceClient, StorageEntity.PROJECT_COVER, objectName);
		}),

	delete: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(projectSelectModelSchema.shape.id)
		.mutation(async (opts) => {
			if (!hasPermission(RolePermissions.PROJECT_DELETE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });
			await db
				.delete(project)
				.where(and(eq(project.id, opts.input), eq(project.organization_id, opts.ctx.role.organization.id)));
		}),
	getMany: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(paginationSchema)
		.query(async (opts): Promise<Collection<ProjectSelectModel>> => {
			const [projects, total] = await Promise.all([
				db
					.select()
					.from(project)
					.where(eq(project.organization_id, opts.ctx.role.organization.id))
					.offset(opts.input.offset)
					.limit(opts.input.limit)
					.orderBy(asc(project.id)),
				db.select({ count: count() }).from(project).where(eq(project.organization_id, opts.ctx.role.organization.id)),
			]);

			const items = await mapProjectsWithImages(projects, supabaseServiceClient);
			return {
				items,
				total: total.at(0)?.count ?? 0,
			};
		}),

	getOne: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(projectSelectModelSchema.shape.id)
		.query(async (opts): Promise<ProjectSelectModel> => {
			const found = await db.query.project.findFirst({
				where: and(eq(project.id, opts.input), eq(project.organization_id, opts.ctx.role.organization.id)),
			});
			if (!found) throw new TRPCError({ code: "NOT_FOUND" });

			const items = await mapProjectsWithImages([found], supabaseServiceClient);

			return items[0];
		}),

	update: procedure
		.use(isAuthorized)
		.use(hasOrganization)
		.input(
			projectSelectModelSchema.pick({
				name: true,
				id: true,
			}),
		)
		.mutation(async (opts): Promise<ProjectSelectModel> => {
			if (!hasPermission(RolePermissions.PROJECT_UPDATE, opts.ctx.role.role))
				throw new TRPCError({ code: "FORBIDDEN" });

			const updated = (
				await db
					.update(project)
					.set({ name: opts.input.name })
					.where(and(eq(project.id, opts.input.id), eq(project.organization_id, opts.ctx.role.organization.id)))
					.returning()
			).at(0);
			if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
			const items = await mapProjectsWithImages([updated], supabaseServiceClient);

			return items[0];
		}),
});
