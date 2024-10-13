interface ImportMetaEnv {
	readonly VITE_SUPABASE: string;
	readonly VITE_SUPABASE_ANON_KEY: string;
	readonly VITE_BASE_URL: string;
	readonly VITE_DB_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
