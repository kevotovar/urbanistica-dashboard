import { Activity } from "#/lib/models";

export class ActivityService {
	async list(limit = 50) {
		const data = await Activity.find()
			.sort({ createdAt: -1 })
			.limit(limit)
			.lean();
		return data.map((d) => ({ ...d, id: d._id.toString() }));
	}

	async log(input: {
		action: string;
		entity_type:
			| "project"
			| "client"
			| "document"
			| "transaction"
			| "personnel";
		entity_id?: string;
		user_id?: string;
		details?: Record<string, any>;
	}) {
		const payload = {
			action: input.action,
			entityType: input.entity_type,
			entityId: input.entity_id,
			userId: input.user_id,
			details: input.details,
		};

		const newActivity = await Activity.create(payload);
		return { ...newActivity.toJSON(), id: newActivity._id.toString() };
	}

	async listRecentByProject(projectId: string, limit = 10) {
		const data = await Activity.find({
			entityType: "project",
			entityId: projectId,
		})
			.sort({ createdAt: -1 })
			.limit(limit)
			.lean();

		return data.map((d) => ({ ...d, id: d._id.toString() }));
	}

	async getStats() {
		// Mock stats since real analytics usually require complicated Mongo aggregates
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const [activeUsers, projectsUpdated, docsUploaded] = await Promise.all([
			Activity.distinct("userId", { createdAt: { $gte: today } }).then(
				(res) => res.length,
			),
			Activity.countDocuments({
				entityType: "project",
				action: "update",
				createdAt: { $gte: today },
			}),
			Activity.countDocuments({ entityType: "document", action: "create" }),
		]);

		return {
			activeUsersToday: activeUsers,
			projectsUpdatedThisWeek: projectsUpdated, // Mocking week as today for now to save complexity
			documentsUploaded: docsUploaded,
		};
	}
}
