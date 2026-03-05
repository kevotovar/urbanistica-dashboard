// src/server/trpc/context.ts

import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "#/lib/auth";

// Services
import { ActivityService } from "#/services/activity.service";
import { AIService } from "#/services/ai.service";
import { ClientService } from "#/services/client.service";
import { DocumentService } from "#/services/document.service";
import { PersonnelService } from "#/services/personnel.service";
import { ProjectService } from "#/services/project.service";
import { TodoService } from "#/services/todo.service";
import { TransactionService } from "#/services/transaction.service";

export type Context = {
	user: any;
	session: any;
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
	let sessionObject = null;
	try {
		const session = await auth.api.getSession({
			headers: opts.req.headers,
		});
		if (session) {
			user = session.user;
			sessionObject = session.session;
		}
	} catch (e) {
		console.error("Failed to get user in context:", e);
	}

	return {
		user,
		session: sessionObject,
		services: {
			client: new ClientService(),
			personnel: new PersonnelService(),
			project: new ProjectService(),
			transaction: new TransactionService(),
			activity: new ActivityService(),
			document: new DocumentService(),
			ai: new AIService(),
			todo: new TodoService(),
		},
	};
}
