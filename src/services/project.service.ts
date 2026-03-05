import mongoose from "mongoose";
import { Project } from "#/lib/models";

export class ProjectService {
	async list() {
		// Mongoose query fetching projects and populating the 'client' document reference
		const data = await Project.find()
			.populate("client")
			.sort({ createdAt: -1 })
			.lean();

		return data.map((d) => ({ ...d, id: d._id.toString() }));
	}

	async getById(id: string) {
		const data = await Project.findById(id)
			.populate("client")
			.populate("assignments") // Populating personnel docs directly thanks to the Array of ObjectIds in schema
			.lean();

		if (!data) throw new Error("Project not found");

		// Format similarly to previous Supabase response
		const mappedAssignments = (data.assignments || []).map((person: any) => ({
			id: person._id.toString(),
			personnel: { ...person, id: person._id.toString() },
		}));

		return {
			...data,
			id: data._id.toString(),
			assignments: mappedAssignments,
		};
	}

	async create(input: {
		name: string;
		description?: string | null;
		status?: "lead" | "active" | "completed" | "on_hold" | "cancelled";
		client_id?: string | null;
		start_date?: string | null;
		end_date?: string | null;
	}) {
		// Map Supabase snake_case interface inputs to Mongoose camelCase schema
		const projData = {
			name: input.name,
			description: input.description,
			status: input.status,
			client: input.client_id
				? new mongoose.Types.ObjectId(input.client_id)
				: undefined,
			startDate: input.start_date,
			endDate: input.end_date,
		};

		const newProj = await Project.create(projData);
		return { ...newProj.toJSON(), id: newProj._id.toString() };
	}

	async assignPersonnel(projectId: string, personnelId: string) {
		// Supabase historically inserted a relation table. With Mongoose, we just push the ObjectId to the array array.
		const updated = await Project.findByIdAndUpdate(
			projectId,
			{ $addToSet: { assignments: new mongoose.Types.ObjectId(personnelId) } },
			{ new: true },
		).lean();

		if (!updated) throw new Error("Project not found");
		return { success: true };
	}
}
