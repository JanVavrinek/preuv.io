interface ImportMetaEnv {
	readonly VITE_JWT_SECRET: string;
	readonly VITE_SUPABASE: string;
	readonly VITE_SUPABASE_ANON_KEY: string;
	readonly VITE_BASE_URL: string;
	readonly VITE_DB_URL: string;
	readonly VITE_EMAIL_CONFIRM_REDIRECT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
