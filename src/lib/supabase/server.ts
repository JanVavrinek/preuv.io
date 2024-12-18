import { createClient } from "@supabase/supabase-js";
/**
 * # This client should never be used on the client!
 */
export const supabaseServiceClient = createClient(
	import.meta.env.VITE_SUPABASE,
	process.env.SUPABASE_SERVICE_KEY ?? "",
);
