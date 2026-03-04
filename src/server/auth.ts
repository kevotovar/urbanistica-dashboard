import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "#/lib/auth-server";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const loginFn = createServerFn({ method: "POST" }).handler(
	async ({
		data,
		request,
	}: {
		data: z.infer<typeof loginSchema>;
		request: Request;
	}) => {
		const { supabase, response } = createSupabaseServerClient(request);

		const { error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});

		if (error) {
			throw new Error(error.message);
		}

		return new Response(JSON.stringify({ success: true }), {
			headers: {
				"Content-Type": "application/json",
				...Object.fromEntries(response.headers.entries()),
			},
		});
	},
);

export const signupFn = createServerFn({ method: "POST" }).handler(
	async ({
		data,
		request,
	}: {
		data: z.infer<typeof loginSchema>;
		request: Request;
	}) => {
		const { supabase, response } = createSupabaseServerClient(request);

		const { error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
		});

		if (error) {
			throw new Error(error.message);
		}

		return new Response(JSON.stringify({ success: true }), {
			headers: {
				"Content-Type": "application/json",
				...Object.fromEntries(response.headers.entries()),
			},
		});
	},
);

export const logoutFn = createServerFn({ method: "POST" }).handler(
	async ({ request }) => {
		const { supabase, response } = createSupabaseServerClient(request);

		const { error } = await supabase.auth.signOut();

		if (error) {
			throw new Error(error.message);
		}

		return new Response(JSON.stringify({ success: true }), {
			headers: {
				"Content-Type": "application/json",
				...Object.fromEntries(response.headers.entries()),
			},
		});
	},
);

export const getSessionFn = createServerFn({ method: "GET" }).handler(
	async ({ request }) => {
		const { supabase } = createSupabaseServerClient(request);
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session;
	},
);
