import type { ProjectSelectModel } from "@lib/db/schemas/project";
import { StorageEntity, createSignedUrls } from "@lib/supabase/storage";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function mapProjectsWithImages(
	projects: ProjectSelectModel[],
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	client: SupabaseClient<any, "public", any>,
) {
	const urls = await createSignedUrls(
		client,
		StorageEntity.PROJECT_COVER,
		projects.filter((p) => p.image).map((p) => `${p.id}/${p.image}`),
	);

	return projects.map((p) => ({
		...p,
		image: urls.data?.find((o) => o.path?.includes(`${p.id}/${p.image}`))?.signedUrl ?? null,
	}));
}
