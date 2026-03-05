import { Client } from "#/lib/models";

export class ClientService {
	async list() {
		// Find all, sort by createdAt descending, and return plain objects.
		const data = await Client.find().sort({ createdAt: -1 }).lean();
		// Since id was previously a number/uuid in supabase, we can map _id to id or leave it depending on usage.
		// It's usually safer to return id as string payload.
		return data.map((d) => ({ ...d, id: d._id.toString() }));
	}

	async getById(id: string) {
		const data = await Client.findById(id).lean();
		if (!data) throw new Error("Client not found");
		return { ...data, id: data._id.toString() };
	}

	async create(input: {
		name: string;
		email?: string | null;
		phone?: string | null;
		address?: string | null;
		company?: string | null;
		notes?: string | null;
	}) {
		const newClient = await Client.create(input);
		return { ...newClient.toJSON(), id: newClient._id.toString() };
	}

	async update(
		id: string,
		input: Partial<{
			name: string;
			email: string | null;
			phone: string | null;
			address: string | null;
			company: string | null;
			notes: string | null;
		}>,
	) {
		const updated = await Client.findByIdAndUpdate(id, input, {
			new: true,
		}).lean();
		if (!updated) throw new Error("Client not found");
		return { ...updated, id: updated._id.toString() };
	}

	async delete(id: string) {
		await Client.findByIdAndDelete(id);
		return { success: true };
	}
}
