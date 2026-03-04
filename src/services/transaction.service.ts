import type { SupabaseClient } from "@supabase/supabase-js";

export class TransactionService {
	constructor(private supabase: SupabaseClient) {}

	async listByProject(projectId: number) {
		const { data, error } = await this.supabase
			.from("transactions")
			.select("*")
			.eq("project_id", projectId)
			.order("date", { ascending: false });

		if (error) throw error;
		return data;
	}

	async getProjectStats(projectId: number) {
		const { data, error } = await this.supabase
			.from("transactions")
			.select("type, amount")
			.eq("project_id", projectId);

		if (error) throw error;

		const income = data
			.filter((r) => r.type === "income")
			.reduce((sum, r) => sum + Number(r.amount), 0);

		const expense = data
			.filter((r) => r.type === "expense")
			.reduce((sum, r) => sum + Number(r.amount), 0);

		return {
			income,
			expense,
			balance: income - expense,
		};
	}

	async create(input: {
		project_id: number;
		type: "income" | "expense";
		amount: string;
		category: string;
		description?: string | null;
		date?: string;
	}) {
		const { data, error } = await this.supabase
			.from("transactions")
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
			.from("transactions")
			.delete()
			.eq("id", id);

		if (error) throw error;
		return { success: true };
	}
}
