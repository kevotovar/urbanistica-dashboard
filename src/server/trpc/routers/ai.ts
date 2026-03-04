import { z } from "zod";
import { publicProcedure, router } from "../init";

export const aiRouter = router({
	summarize: publicProcedure
		.input(z.object({ documentId: z.number(), model: z.string().optional() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.ai.summarize(
				input.documentId,
				input.model,
				ctx.user?.id,
			);
		}),

	createChatSession: publicProcedure
		.input(z.object({ documentId: z.number(), title: z.string().optional() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.ai.createChatSession(
				input.documentId,
				ctx.user?.id,
				input.title,
			);
		}),

	sendMessage: publicProcedure
		.input(
			z.object({
				sessionId: z.number(),
				message: z.string(),
				model: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.ai.sendMessage({
				...input,
				userId: ctx.user?.id,
			});
		}),
});
