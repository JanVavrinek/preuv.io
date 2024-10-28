"use server";

import { createClient } from "@supabase/supabase-js";
/**
 * # This client should never be used on the client!
 */

export default function getServerSupabaseClient() {
	return createClient(import.meta.env.VITE_SUPABASE, import.meta.env.VITE_SUPABASE_SERVICE_KEY);
}
