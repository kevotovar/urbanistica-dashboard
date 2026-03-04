import { z } from "zod";
import { publicProcedure, router } from "../init";

export const documentsRouter = router({
	listByProject: publicProcedure
		.input(z.object({ projectId: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.services.document.listByProject(input.projectId);
		}),

	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.services.document.getById(input.id);
		}),

	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.document.delete(input.id);
		}),
});
