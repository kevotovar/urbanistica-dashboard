// src/lib/trpc.ts

import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "#/server/trpc/router";

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient(baseUrl = "/api/trpc") {
	return trpc.createClient({
		links: [
			httpLink({
				url: baseUrl,
			}),
		],
	});
}
