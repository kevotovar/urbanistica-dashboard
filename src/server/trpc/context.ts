// src/server/trpc/context.ts

import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { createSupabaseServerClient, getUser } from "#/lib/auth-server";
import { getSupabaseAdmin } from "#/lib/supabase";
import { ActivityService } from "#/services/activity.service";
import { AIService } from "#/services/ai.service";
// Services
import { ClientService } from "#/services/client.service";
import { DocumentService } from "#/services/document.service";
import { PersonnelService } from "#/services/personnel.service";
import { ProjectService } from "#/services/project.service";
import { TodoService } from "#/services/todo.service";
import { TransactionService } from "#/services/transaction.service";

export type Context = {
	user: any;
	services: {
		client: ClientService;
		personnel: PersonnelService;
		project: ProjectService;
		transaction: TransactionService;
		activity: ActivityService;
		document: DocumentService;
		ai: AIService;
		todo: TodoService;
	};
};

export async function createContext(
	opts: FetchCreateContextFnOptions,
): Promise<Context> {
	let user = null;
	try {
		user = await getUser(opts.req);
	} catch (e) {
		console.error("Failed to get user in context:", e);
	}

	const admin = getSupabaseAdmin();

	return {
		user,
		services: {
			client: new ClientService(admin),
			personnel: new PersonnelService(admin),
			project: new ProjectService(admin),
			transaction: new TransactionService(admin),
			activity: new ActivityService(admin),
			document: new DocumentService(admin),
			ai: new AIService(admin),
			todo: new TodoService(admin),
		},
	};
}
