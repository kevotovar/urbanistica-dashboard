import { createClient } from "@supabase/supabase-js";

// Helper to get env vars that works on both client (Vite) and server (Node/Vinxi)
function getEnv(key: string): string {
	if (typeof window !== "undefined") {
		// Client side
		return (import.meta as any).env[key] || "";
	}
	// Server side
	return process.env[key] || (import.meta as any).env?.[key] || "";
}

export const SUPABASE_URL = getEnv("VITE_SUPABASE_URL");
export const SUPABASE_ANON_KEY = getEnv("VITE_SUPABASE_ANON_KEY");

// Standard client for browser and basic server queries (respects RLS)
export const supabase = createClient(
	SUPABASE_URL || "",
	SUPABASE_ANON_KEY || "",
);

/**
 * Service role client for server-side elevated operations (bypasses RLS).
 * Use this only in server functions or TRPC procedures that need admin access.
 */
export const getSupabaseAdmin = () => {
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!serviceKey) {
		throw new Error(
			"SUPABASE_SERVICE_ROLE_KEY is missing! This should only be used on the server.",
		);
	}

	return createClient(SUPABASE_URL || "", serviceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
};
