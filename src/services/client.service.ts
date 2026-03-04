import type { SupabaseClient } from "@supabase/supabase-js";

export class ClientService {
	constructor(private supabase: SupabaseClient) {}

	async list() {
		const { data, error } = await this.supabase
			.from("clients")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data;
	}

	async getById(id: number) {
		const { data, error } = await this.supabase
			.from("clients")
			.select("*")
			.eq("id", id)
			.single();

		if (error) throw error;
		return data;
	}

	async create(input: {
		name: string;
		email?: string | null;
		phone?: string | null;
		address?: string | null;
		company?: string | null;
		notes?: string | null;
	}) {
		const { data, error } = await this.supabase
			.from("clients")
			.insert(input)
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	async update(
		id: number,
		input: Partial<{
			name: string;
			email: string | null;
			phone: string | null;
			address: string | null;
			company: string | null;
			notes: string | null;
		}>,
	) {
		const { data, error } = await this.supabase
			.from("clients")
			.update({ ...input, updated_at: new Date().toISOString() })
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	async delete(id: number) {
		const { error } = await this.supabase.from("clients").delete().eq("id", id);

		if (error) throw error;
		return { success: true };
	}
}
