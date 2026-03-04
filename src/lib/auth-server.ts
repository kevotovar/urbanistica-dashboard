import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase";

/**
 * Creates a Supabase client for server-side use in TanStack Start.
 * Handles reading and writing cookies via standard Web Request/Response objects.
 */
export const createSupabaseServerClient = (request: Request) => {
	const response = new Response();

	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		console.error("Supabase configuration is missing on the server!");
	}

	const supabase = createServerClient(
		SUPABASE_URL || "",
		SUPABASE_ANON_KEY || "",
		{
			cookies: {
				getAll() {
					const cookieHeader = request.headers.get("cookie") || "";
					const cookies: { name: string; value: string }[] = [];

					cookieHeader.split(";").forEach((cookie) => {
						const [name, value] = cookie.trim().split("=");
						if (name && value) {
							cookies.push({
								name,
								value: decodeURIComponent(value),
							});
						}
					});

					return cookies;
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						const cookieString = `${name}=${encodeURIComponent(value)}`;
						const optionsString = options
							? Object.entries(options)
									.map(([key, val]) => {
										if (key === "maxAge") return `Max-Age=${val}`;
										if (key === "httpOnly" && val) return "HttpOnly";
										if (key === "secure" && val) return "Secure";
										if (key === "sameSite") return `SameSite=${val}`;
										if (key === "path") return `Path=${val}`;
										if (key === "domain") return `Domain=${val}`;
										return "";
									})
									.filter(Boolean)
									.join("; ")
							: "";

						const fullCookie = optionsString
							? `${cookieString}; ${optionsString}`
							: cookieString;

						response.headers.append("set-cookie", fullCookie);
					});
				},
			},
		},
	);

	return { supabase, response };
};

/**
 * Helper to extract user from request context.
 */
export const getUser = async (request: Request) => {
	try {
		const { supabase } = createSupabaseServerClient(request);
		const {
			data: { user },
		} = await supabase.auth.getUser();
		return user;
	} catch (e) {
		console.error("Error getting user in server context:", e);
		return null;
	}
};

/**
 * Helper to extract session from request context.
 */
export const getSession = async (request: Request) => {
	try {
		const { supabase } = createSupabaseServerClient(request);
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session;
	} catch (e) {
		console.error("Error getting session in server context:", e);
		return null;
	}
};
