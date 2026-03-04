// src/server/trpc/router.ts
import { router } from "./init";
import { activitiesRouter } from "./routers/activities";
import { aiRouter } from "./routers/ai";
import { clientsRouter } from "./routers/clients";
import { documentsRouter } from "./routers/documents";
import { personnelRouter } from "./routers/personnel";
import { projectsRouter } from "./routers/projects";
import { todosRouter } from "./routers/todos";
import { transactionsRouter } from "./routers/transactions";

export const appRouter = router({
	todos: todosRouter,
	clients: clientsRouter,
	personnel: personnelRouter,
	projects: projectsRouter,
	documents: documentsRouter,
	ai: aiRouter,
	financials: transactionsRouter,
	activities: activitiesRouter,
});

export type AppRouter = typeof appRouter;
