import { z } from "zod";
import { publicProcedure, router } from "../init";

export const todosRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		return await ctx.services.todo.list();
	}),

	create: publicProcedure
		.input(z.object({ title: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.todo.create(input.title);
		}),
});
