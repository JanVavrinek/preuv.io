import { db } from "@lib/db";
import {} from "@lib/db/schemas/organization";
import {
	type ProjectSelectModel,
	project,
	projectInsertModelSchema,
	projectSelectModelSchema,
} from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import getServerSupabaseClient from "@lib/supabase/server";
import {
	StorageEntity,
	createSignedUploadUrl,
	createSignedUrl,
	createSignedUrls,
	storageObjectDelete,
	storageObjectInfo,
} from "@lib/supabase/storage";
import { procedure, router } from "@lib/trpc/init";
import { isAuthorized } from "@lib/trpc/middlewares";
import { hasOrganization } from "@lib/trpc/middlewares/hasOrganization";
import { paginationSchema } from "@lib/trpc/schemas";
import { TRPCError } from "@trpc/server";
import { hasPermission } from "@utils/permissions";
import { and, asc, count, eq } from "drizzle-orm";
import { updatePhotoMutationInputSchema } from "./schemas";

const client = getServerSupabaseClient();

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
			const url = await createSignedUploadUrl(client, StorageEntity.PROJECT_COVER, `${orgProject.id}/${id}`);
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

			const exists = await storageObjectInfo(client, StorageEntity.PROJECT_COVER, objectName);
			if (!exists.data) throw new TRPCError({ code: "NOT_FOUND" });
			if (!exists.data.contentType?.startsWith("image/")) {
				storageObjectDelete(client, StorageEntity.PROJECT_COVER, [objectName]);
				throw new TRPCError({ code: "UNSUPPORTED_MEDIA_TYPE" });
			}
			await db.update(project).set({ image: opts.input.image });
			return createSignedUrl(client, StorageEntity.PROJECT_COVER, objectName);
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
		.query(async (opts) => {
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
			const urls = await createSignedUrls(
				client,
				StorageEntity.PROJECT_COVER,
				projects.filter((p) => p.image).map((p) => `${p.id}/${p.image}`),
			);

			return {
				items: projects.map((p) => ({
					...p,
					image: urls.data?.find((o) => o.path?.includes(`${p.id}/${p.image}`))?.signedUrl,
				})),
				total: total.at(0)?.count ?? 0,
			};
		}),
});
