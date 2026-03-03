// src/server/trpc/routers/todos.ts
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { todos } from "#/db/schema";
import { publicProcedure, router } from "../init";

export const todosRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.select().from(todos).orderBy(desc(todos.createdAt));
	}),

	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			const [todo] = await ctx.db
				.select()
				.from(todos)
				.where(eq(todos.id, input.id))
				.limit(1);
			if (!todo) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
			}
			return todo;
		}),

	create: publicProcedure
		.input(z.object({ title: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const [todo] = await ctx.db
				.insert(todos)
				.values({ title: input.title })
				.returning();
			return todo;
		}),

	toggle: publicProcedure.input(z.object({ id: z.number() })).mutation(() => {
		throw new TRPCError({
			code: "NOT_IMPLEMENTED",
			message: "Toggle requires a schema migration to add a complete column",
		});
	}),
});
