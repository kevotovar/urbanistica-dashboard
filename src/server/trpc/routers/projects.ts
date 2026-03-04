import { z } from "zod";
import { publicProcedure, router } from "../init";

export const projectsRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		return await ctx.services.project.list();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.services.project.getById(input.id);
		}),

	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				description: z.string().optional().nullable(),
				status: z
					.enum(["lead", "active", "completed", "on_hold", "cancelled"])
					.optional(),
				clientId: z.number().optional().nullable(),
				startDate: z.date().optional().nullable(),
				endDate: z.date().optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { clientId, startDate, endDate, ...rest } = input;
			return await ctx.services.project.create({
				...rest,
				client_id: clientId,
				start_date: startDate?.toISOString(),
				end_date: endDate?.toISOString(),
			});
		}),

	assignPersonnel: publicProcedure
		.input(
			z.object({
				projectId: z.number(),
				personnelId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.project.assignPersonnel(
				input.projectId,
				input.personnelId,
			);
		}),
});
