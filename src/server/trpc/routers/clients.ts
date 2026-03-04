import { z } from "zod";
import { publicProcedure, router } from "../init";

export const clientsRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		return await ctx.services.client.list();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.services.client.getById(input.id);
		}),

	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				email: z.string().email().optional().nullable(),
				phone: z.string().optional().nullable(),
				address: z.string().optional().nullable(),
				company: z.string().optional().nullable(),
				notes: z.string().optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.client.create(input);
		}),

	update: publicProcedure
		.input(
			z.object({
				id: z.number(),
				name: z.string().min(1).optional(),
				email: z.string().email().optional().nullable(),
				phone: z.string().optional().nullable(),
				address: z.string().optional().nullable(),
				company: z.string().optional().nullable(),
				notes: z.string().optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			return await ctx.services.client.update(id, data);
		}),

	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.client.delete(input.id);
		}),
});
