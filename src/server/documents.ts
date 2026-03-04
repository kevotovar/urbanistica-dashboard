import { createServerFn } from "@tanstack/react-start";
import { getUser } from "#/lib/auth-server";
import { getSupabaseAdmin } from "#/lib/supabase";
import { uploadDocument } from "#/lib/supabase-storage";

export const uploadProjectDocument = createServerFn({
	method: "POST",
}).handler(async ({ data, request }: { data: FormData; request: Request }) => {
	const file = data.get("file") as File | null;
	const projectIdStr = data.get("projectId") as string | null;

	if (!file || !projectIdStr) {
		throw new Error("Missing file or projectId");
	}

	const projectId = parseInt(projectIdStr);
	const user = await getUser(request);

	if (!user) {
		throw new Error("Unauthorized");
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const uploadResult = await uploadDocument(projectId, buffer, file.name);

	if (!uploadResult.success) {
		throw new Error(uploadResult.error?.message || "Upload failed");
	}

	const admin = getSupabaseAdmin();
	const { data: doc, error } = await admin
		.from("documents")
		.insert({
			project_id: projectId,
			title: file.name,
			storage_path: uploadResult.path!,
			file_type: file.type,
			metadata: {
				size: file.size,
				lastModified: file.lastModified,
			},
		})
		.select()
		.single();

	if (error) throw new Error(error.message);

	return doc;
});
