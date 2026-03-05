import { Personnel } from "#/lib/models";

export class PersonnelService {
	async list() {
		const data = await Personnel.find().sort({ createdAt: -1 }).lean();
		return data.map((d) => ({ ...d, id: d._id.toString() }));
	}

	async getById(id: string) {
		const data = await Personnel.findById(id).lean();
		if (!data) throw new Error("Personnel not found");
		return { ...data, id: data._id.toString() };
	}

	async create(input: {
		name: string;
		email: string;
		role?: "admin" | "architect" | "designer" | "legal" | "external";
		avatar_url?: string | null;
		auth_user_id?: string | null;
	}) {
		const personnelData = {
			name: input.name,
			email: input.email,
			role: input.role,
			avatarUrl: input.avatar_url,
			authUserId: input.auth_user_id,
		};
		const newPersonnel = await Personnel.create(personnelData);
		return { ...newPersonnel.toJSON(), id: newPersonnel._id.toString() };
	}

	async update(
		id: string,
		input: Partial<{
			name: string;
			email: string;
			role: "admin" | "architect" | "designer" | "legal" | "external";
			avatar_url: string | null;
			auth_user_id: string | null;
		}>,
	) {
		// Map any possible snake_case input fields to camelCase for Mongoose
		const updateData: any = { ...input };
		if (input.avatar_url !== undefined) updateData.avatarUrl = input.avatar_url;
		if (input.auth_user_id !== undefined)
			updateData.authUserId = input.auth_user_id;

		const updated = await Personnel.findByIdAndUpdate(id, updateData, {
			new: true,
		}).lean();
		if (!updated) throw new Error("Personnel not found");
		return { ...updated, id: updated._id.toString() };
	}
}
