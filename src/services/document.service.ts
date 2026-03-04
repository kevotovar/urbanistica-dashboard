import type { SupabaseClient } from "@supabase/supabase-js";

export class DocumentService {
	constructor(private supabase: SupabaseClient) {}

	async listByProject(projectId: number) {
		const { data, error } = await this.supabase
			.from("documents")
			.select("*")
			.eq("project_id", projectId)
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data;
	}

	async getById(id: number) {
		const { data, error } = await this.supabase
			.from("documents")
			.select("*")
			.eq("id", id)
			.single();

		if (error) throw error;
		return data;
	}

	async delete(id: number) {
		const { data: doc } = await this.supabase
			.from("documents")
			.select("storage_path")
			.eq("id", id)
			.single();

		if (doc) {
			await this.supabase.storage
				.from("project-documents")
				.remove([doc.storage_path]);
		}

		const { error } = await this.supabase
			.from("documents")
			.delete()
			.eq("id", id);

		if (error) throw error;
		return { success: true };
	}
}
