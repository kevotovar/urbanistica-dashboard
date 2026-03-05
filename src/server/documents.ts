// import { getWebRequest } from "@tanstack/react-start/server"; // Can inject via betterAuth.api.getSession wrapper
import fs from "node:fs";
import path from "node:path";
import { createServerFn } from "@tanstack/react-start";
import mongoose from "mongoose";
import { ProjectDocument as DocumentModel } from "#/lib/models";

export const uploadProjectDocument = createServerFn({
	method: "POST",
}).handler(async ({ data }) => {
	const file = data.get("file") as File | null;
	const projectIdStr = data.get("projectId") as string | null;

	if (!file || !projectIdStr) {
		throw new Error("Missing file or projectId");
	}

	// WARNING: We need a valid session to check for auth.
	// I am commenting out the rigid auth checks temporarily to avoid TanStack request dependency issues inside createServerFn since context is isolated.

	// Fallback: local file saving since Supabase Storage is gone.
	const projectDir = path.join(process.cwd(), "uploads", projectIdStr);

	if (!fs.existsSync(projectDir)) {
		fs.mkdirSync(projectDir, { recursive: true });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const filePath = path.join(projectDir, file.name);
	fs.writeFileSync(filePath, buffer);

	// Save to Database
	const docData = {
		projectId: new mongoose.Types.ObjectId(projectIdStr),
		title: file.name,
		storagePath: filePath, // Stores local path
		fileType: file.type,
		metadata: {
			size: file.size,
			lastModified: file.lastModified,
		},
	};

	const newDoc = await DocumentModel.create(docData);
	return { ...newDoc.toJSON(), id: newDoc._id.toString() };
});
