// src/server/trpc/context.ts
import { db } from "#/db/index";

export type Context = {
	db: typeof db;
};

export async function createContext(): Promise<Context> {
	return { db };
}
