import { getSupabaseAdmin, supabase } from "./supabase";

/**
 * Ensures the 'project-documents' bucket exists and is configured correctly.
 * Note: In production, it's safer to create buckets via the Supabase Dashboard,
 * but this utility helps in development or for quick setup.
 */
export const ensureDocumentBucket = async () => {
	const admin = getSupabaseAdmin();

	const { error } = await admin.storage.getBucket("project-documents");

	if (error && error.message.includes("not found")) {
		console.log("Creating 'project-documents' bucket...");
		const { error: createError } = await admin.storage.createBucket(
			"project-documents",
			{
				public: false, // Keep documents private by default
				allowedMimeTypes: [
					"application/pdf",
					"text/markdown",
					"text/plain",
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				],
				fileSizeLimit: 52428800, // 50MB
			},
		);

		if (createError) {
			console.error("Error creating bucket:", createError);
			return { success: false, error: createError };
		}

		return { success: true, created: true };
	}

	return { success: true, exists: true };
};

export const uploadDocument = async (
	projectId: number,
	file: File | Buffer,
	fileName: string,
) => {
	const path = `${projectId}/${Date.now()}_${fileName}`;
	const { data, error } = await supabase.storage
		.from("project-documents")
		.upload(path, file);

	if (error) return { success: false, error };

	return { success: true, path: data.path };
};
