import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "#/lib/auth";

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

export const loginFn = createServerFn({ method: "POST" })
	.inputValidator((data) => loginSchema.parse(data))
	.handler(async ({ data }) => {
		// Better Auth login should ideally happen via the auth-client.
		// Server functions can fetch session directly.
		return { success: true };
	});

export const signupFn = createServerFn({ method: "POST" })
	.inputValidator((data) => loginSchema.parse(data))
	.handler(async () => {
		return { success: true };
	});

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	return { success: true };
});

export const getSessionFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const request = getRequest();
	if (!request) return null;
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	return session;
});

export const getProfileFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const request = getRequest();
	if (!request) return null;
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	return session?.user ?? null;
});
