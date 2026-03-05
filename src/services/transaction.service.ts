import mongoose from "mongoose";
import { Transaction } from "#/lib/models";

export class TransactionService {
	async listByProject(projectId: string) {
		const data = await Transaction.find({
			project: new mongoose.Types.ObjectId(projectId),
		})
			.sort({ date: -1 })
			.lean();
		return data.map((d) => ({ ...d, id: d._id.toString() }));
	}

	async getProjectStats(projectId: string) {
		const data = await Transaction.find({
			projectId: new mongoose.Types.ObjectId(projectId),
		})
			.select("type amount")
			.lean();

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
		project_id: string;
		type: "income" | "expense";
		amount: string | number;
		category: string;
		description?: string | null;
		date?: string;
	}) {
		const payload = {
			projectId: new mongoose.Types.ObjectId(input.project_id),
			type: input.type,
			amount: Number(input.amount),
			category: input.category,
			description: input.description,
			date: input.date ? new Date(input.date) : new Date(),
		};

		const newTx = await Transaction.create(payload);
		return { ...newTx.toJSON(), id: newTx._id.toString() };
	}

	async delete(id: string) {
		await Transaction.findByIdAndDelete(id);
		return { success: true };
	}
}
