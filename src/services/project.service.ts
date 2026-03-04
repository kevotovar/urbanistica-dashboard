import type { SupabaseClient } from "@supabase/supabase-js";

export class ProjectService {
	constructor(private supabase: SupabaseClient) {}

	async list() {
		const { data, error } = await this.supabase
			.from("projects")
			.select("*, client:clients(*)")
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data;
	}

	async getById(id: number) {
		const { data, error } = await this.supabase
			.from("projects")
			.select(
				"*, client:clients(*), assignments:project_assignments(*, personnel:personnel(*))",
			)
			.eq("id", id)
			.single();

		if (error) throw error;
		return data;
	}

	async create(input: {
		name: string;
		description?: string | null;
		status?: "lead" | "active" | "completed" | "on_hold" | "cancelled";
		client_id?: number | null;
		start_date?: string | null;
		end_date?: string | null;
	}) {
		const { data, error } = await this.supabase
			.from("projects")
			.insert(input)
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	async assignPersonnel(projectId: number, personnelId: number) {
		const { data, error } = await this.supabase
			.from("project_assignments")
			.insert({ project_id: projectId, personnel_id: personnelId })
			.select()
			.single();

		if (error) throw error;
		return data;
	}
}
