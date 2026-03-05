import mongoose from "mongoose";
import { ProjectDocument as DocumentModel } from "#/lib/models";

export class DocumentService {
	async listByProject(projectId: string) {
		const data = await DocumentModel.find({
			projectId: new mongoose.Types.ObjectId(projectId),
		})
			.sort({ createdAt: -1 })
			.lean();
		return data.map((d) => ({ ...d, id: d._id.toString() }));
	}

	async getById(id: string) {
		const data = await DocumentModel.findById(id).lean();
		if (!data) throw new Error("Document not found");
		return { ...data, id: data._id.toString() };
	}

	async delete(id: string) {
		const _doc = await DocumentModel.findById(id).lean();

		// TODO: Mongoose doesn't support storage bucket removals natively.
		// Need to implement custom file removal from S3 or local FS depending on user requirements.
		/*
		if (doc && doc.storagePath) {
            // Delete from Storage here
		}
        */

		await DocumentModel.findByIdAndDelete(id);
		return { success: true };
	}
}
