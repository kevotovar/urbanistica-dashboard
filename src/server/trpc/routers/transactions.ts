import { z } from "zod";
import { publicProcedure, router } from "../init";

export const transactionsRouter = router({
	listByProject: publicProcedure
		.input(z.object({ projectId: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.services.transaction.listByProject(input.projectId);
		}),

	getProjectStats: publicProcedure
		.input(z.object({ projectId: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.services.transaction.getProjectStats(input.projectId);
		}),

	create: publicProcedure
		.input(
			z.object({
				projectId: z.number(),
				type: z.enum(["income", "expense"]),
				amount: z.string(),
				category: z.string(),
				description: z.string().optional().nullable(),
				date: z.date().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { projectId, date, ...rest } = input;
			return await ctx.services.transaction.create({
				...rest,
				project_id: projectId,
				date: date?.toISOString(),
			});
		}),

	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.transaction.delete(input.id);
		}),
});
