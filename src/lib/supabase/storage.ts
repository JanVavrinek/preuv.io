import { join } from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
export enum StorageEntity {
	PROJECT_COVER = "project/cover",
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Client = SupabaseClient<any, "public", any>;
type TransformOptions = NonNullable<
	NonNullable<Parameters<ReturnType<Client["storage"]["from"]>["createSignedUrl"]>[2]>["transform"]
>;

export function createSignedUploadUrl(client: Client, entity: StorageEntity, objectName: string, upsert = false) {
	return client.storage
		.from(process.env.STORAGE_BUCKET ?? "")
		.createSignedUploadUrl(join(entity, objectName), { upsert });
}

export function createSignedUrl(
	client: Client,
	entity: StorageEntity,
	objectName: string,
	expiresIn = 3600,
	transform?: TransformOptions,
) {
	return client.storage
		.from(process.env.STORAGE_BUCKET ?? "")
		.createSignedUrl(join(entity, objectName), expiresIn, { transform });
}

export function createSignedUrls(client: Client, entity: StorageEntity, objectNames: string[], expiresIn = 3600) {
	return client.storage.from(process.env.STORAGE_BUCKET ?? "").createSignedUrls(
		objectNames.map((i) => join(entity, i)),
		expiresIn,
	);
}

export function storageObjectExists(client: Client, entity: StorageEntity, objectName: string) {
	return client.storage.from(process.env.STORAGE_BUCKET ?? "").exists(join(entity, objectName));
}

export function storageObjectInfo(client: Client, entity: StorageEntity, objectName: string) {
	return client.storage.from(process.env.STORAGE_BUCKET ?? "").info(join(entity, objectName));
}

export function storageObjectDelete(client: Client, entity: StorageEntity, objectNames: string[]) {
	return client.storage.from(process.env.STORAGE_BUCKET ?? "").remove(objectNames.map((i) => join(entity, i)));
}
