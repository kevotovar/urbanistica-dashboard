import type { SupabaseClient } from "@supabase/supabase-js";

export class PersonnelService {
	constructor(private supabase: SupabaseClient) {}

	async list() {
		const { data, error } = await this.supabase
			.from("personnel")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data;
	}

	async getById(id: number) {
		const { data, error } = await this.supabase
			.from("personnel")
			.select("*")
			.eq("id", id)
			.single();

		if (error) throw error;
		return data;
	}

	async create(input: {
		name: string;
		email: string;
		role?: "admin" | "architect" | "designer" | "legal" | "external";
		avatar_url?: string | null;
		auth_user_id?: string | null;
	}) {
		const { data, error } = await this.supabase
			.from("personnel")
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
			email: string;
			role: "admin" | "architect" | "designer" | "legal" | "external";
			avatar_url: string | null;
			auth_user_id: string | null;
		}>,
	) {
		const { data, error } = await this.supabase
			.from("personnel")
			.update({ ...input, updated_at: new Date().toISOString() })
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;
		return data;
	}
}
