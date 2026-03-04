import { z } from "zod";
import { publicProcedure, router } from "../init";

export const activitiesRouter = router({
	listByProject: publicProcedure
		.input(z.object({ projectId: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.services.activity.listByProject(input.projectId);
		}),

	create: publicProcedure
		.input(
			z.object({
				projectId: z.number(),
				personnelId: z.number(),
				description: z.string().min(1),
				hours: z.string().optional(),
				date: z.date().optional(),
				metadata: z.any().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { projectId, personnelId, date, ...rest } = input;
			return await ctx.services.activity.create({
				...rest,
				project_id: projectId,
				personnel_id: personnelId,
				date: date?.toISOString(),
			});
		}),

	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.activity.delete(input.id);
		}),
});
