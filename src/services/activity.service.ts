import type { SupabaseClient } from "@supabase/supabase-js";

export class ActivityService {
	constructor(private supabase: SupabaseClient) {}

	async listByProject(projectId: number) {
		const { data, error } = await this.supabase
			.from("activities")
			.select("*, personnel:personnel(*)")
			.eq("project_id", projectId)
			.order("date", { ascending: false });

		if (error) throw error;
		return data;
	}

	async create(input: {
		project_id: number;
		personnel_id: number;
		description: string;
		hours?: string | null;
		date?: string;
		metadata?: any;
	}) {
		const { data, error } = await this.supabase
			.from("activities")
			.insert({
				...input,
				date: input.date || new Date().toISOString(),
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	async delete(id: number) {
		const { error } = await this.supabase
			.from("activities")
			.delete()
			.eq("id", id);

		if (error) throw error;
		return { success: true };
	}
}
