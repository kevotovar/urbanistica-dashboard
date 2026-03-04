// src/routes/api/trpc.$.tsx
import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "#/server/trpc/context";
import { appRouter } from "#/server/trpc/router";

export const Route = createFileRoute("/api/trpc/$")({
	component: () => null,
	server: {
		handlers: {
			ANY: async ({ request }) => {
				return fetchRequestHandler({
					endpoint: "/api/trpc",
					req: request,
					router: appRouter,
					createContext: async (opts) => createContext(opts),
				});
			},
		},
	},
});
