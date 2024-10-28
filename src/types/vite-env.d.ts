interface ImportMetaEnv {
	readonly VITE_JWT_SECRET: string;
	readonly VITE_SUPABASE: string;
	readonly VITE_SUPABASE_ANON_KEY: string;
	readonly VITE_BASE_URL: string;
	readonly VITE_DB_URL: string;
	readonly VITE_EMAIL_CONFIRM_REDIRECT: string;
	/**
	 * # This key should never be exposed to clients!
	 */
	readonly VITE_SUPABASE_SERVICE_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
