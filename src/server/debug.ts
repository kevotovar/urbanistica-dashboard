import { createServerFn } from "@tanstack/react-start";

export const debugEnvFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return {
			keys: Object.keys(process.env).filter(
				(k) => k.includes("SUPABASE") || k.includes("VITE"),
			),
			nodeEnv: process.env.NODE_ENV,
			hasUrl: !!process.env.VITE_SUPABASE_URL,
			hasAnon: !!process.env.VITE_SUPABASE_ANON_KEY,
			hasSecret: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
		};
	},
);
