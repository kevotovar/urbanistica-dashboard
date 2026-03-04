import { Loader2, Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { uploadProjectDocument } from "#/server/documents";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface DocumentUploadProps {
	projectId: number;
	onSuccess?: (doc: any) => void;
}

export function DocumentUpload({ projectId, onSuccess }: DocumentUploadProps) {
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		setIsUploading(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("projectId", projectId.toString());

			const doc = await uploadProjectDocument({ data: formData });

			setFile(null);
			// Reset input
			const input = document.getElementById(
				"document-file",
			) as HTMLInputElement;
			if (input) input.value = "";

			onSuccess?.(doc);
		} catch (err: any) {
			setError(err.message || "Failed to upload document");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<form
			onSubmit={handleUpload}
			className="space-y-4 border p-4 rounded-lg bg-card"
		>
			<div className="space-y-2">
				<Label htmlFor="document-file">Upload Document (PDF, MD, TXT)</Label>
				<Input
					id="document-file"
					type="file"
					accept=".pdf,.md,.txt"
					onChange={(e) => setFile(e.target.files?.[0] || null)}
					disabled={isUploading}
				/>
			</div>

			{error && <p className="text-sm text-destructive">{error}</p>}

			<Button type="submit" disabled={!file || isUploading} className="w-full">
				{isUploading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
					</>
				) : (
					<>
						<Upload className="mr-2 h-4 w-4" /> Upload Document
					</>
				)}
			</Button>
		</form>
	);
}
