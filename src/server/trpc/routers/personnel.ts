import { z } from "zod";
import { publicProcedure, router } from "../init";

export const personnelRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		return await ctx.services.personnel.list();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.services.personnel.getById(input.id);
		}),

	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				email: z.string().email(),
				role: z
					.enum(["admin", "architect", "designer", "legal", "external"])
					.optional(),
				avatarUrl: z.string().url().optional().nullable(),
				authUserId: z.string().uuid().optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { avatarUrl, authUserId, ...rest } = input;
			return await ctx.services.personnel.create({
				...rest,
				avatar_url: avatarUrl,
				auth_user_id: authUserId,
			});
		}),

	update: publicProcedure
		.input(
			z.object({
				id: z.number(),
				name: z.string().min(1).optional(),
				email: z.string().email().optional(),
				role: z
					.enum(["admin", "architect", "designer", "legal", "external"])
					.optional(),
				avatarUrl: z.string().url().optional().nullable(),
				authUserId: z.string().uuid().optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, avatarUrl, authUserId, ...rest } = input;
			return await ctx.services.personnel.update(id, {
				...rest,
				avatar_url: avatarUrl,
				auth_user_id: authUserId,
			} as any);
		}),
});
