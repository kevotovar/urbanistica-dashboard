// src/server/trpc/router.ts
import { router } from "./init";
import { todosRouter } from "./routers/todos";

export const appRouter = router({
	todos: todosRouter,
});

export type AppRouter = typeof appRouter;
