import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "#/lib/auth-server";
import type { Profile } from "#/types/auth";

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

export const loginFn = createServerFn({ method: "POST" })
	.inputValidator((data) => {
		return loginSchema.parse(data);
	})
	.handler(async ({ data, context }) => {
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
	});

export const signupFn = createServerFn({ method: "POST" }).handler(
	async ({
		data,
		request,
	}: {
		data: z.infer<typeof loginSchema>;
		request: Request;
	}) => {
		const parsed = loginSchema.parse(data);
		const { supabase, response } = createSupabaseServerClient(request);

		const { error } = await supabase.auth.signUp({
			email: parsed.email,
			password: parsed.password,
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
	async ({ request }: { request: Request }) => {
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

export const getSessionFn = createServerFn({
	method: "GET",
}).handler(async ({ request }: { request: Request }) => {
	const { supabase } = createSupabaseServerClient(request);
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
});

export const getProfileFn = createServerFn({
	method: "GET",
}).handler(async ({ request }: { request: Request }) => {
	const { supabase } = createSupabaseServerClient(request);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const { data: profile, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	if (error) {
		console.error("Error fetching profile:", error);
		return null;
	}

	return profile as Profile;
});
