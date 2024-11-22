interface ImportMetaEnv {
	readonly VITE_SUPABASE: string;
	readonly VITE_SUPABASE_ANON_KEY: string;
	readonly VITE_BASE_URL: string;
	readonly VITE_EMAIL_CONFIRM_REDIRECT: string;
	readonly VITE_STORAGE_BUCKET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
