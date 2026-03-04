import type { SupabaseClient } from "@supabase/supabase-js";

export class TodoService {
	constructor(private supabase: SupabaseClient) {}

	async list() {
		const { data, error } = await this.supabase
			.from("todos")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data;
	}

	async create(title: string) {
		const { data, error } = await this.supabase
			.from("todos")
			.insert({ title })
			.select()
			.single();

		if (error) throw error;
		return data;
	}
}
