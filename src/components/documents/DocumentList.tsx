import { FileText, Loader2, MessageSquare, Trash2, Wand2 } from "lucide-react";
import { trpc } from "#/lib/trpc";
import { Button } from "../ui/button";

interface DocumentListProps {
	projectId: number;
	onSelectChat?: (docId: number) => void;
}

export function DocumentList({ projectId, onSelectChat }: DocumentListProps) {
	const utils = trpc.useUtils();
	const { data: documents, isLoading } = trpc.documents.listByProject.useQuery({
		projectId,
	});

	const deleteMutation = trpc.documents.delete.useMutation({
		onSuccess: () => {
			utils.documents.listByProject.invalidate({ projectId });
		},
	});

	const summarizeMutation = trpc.ai.summarize.useMutation();

	if (isLoading)
		return (
			<div className="flex justify-center p-8">
				<Loader2 className="animate-spin" />
			</div>
		);

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Project Documents</h3>
			<div className="grid gap-2">
				{documents?.map((doc) => (
					<div
						key={doc.id}
						className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
					>
						<div className="flex items-center gap-3">
							<FileText className="text-blue-500" />
							<div>
								<p className="font-medium text-sm">{doc.title}</p>
								{doc.summary && (
									<p className="text-xs text-muted-foreground line-clamp-1 italic">
										{doc.summary}
									</p>
								)}
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => summarizeMutation.mutate({ documentId: doc.id })}
								disabled={summarizeMutation.isPending}
								title="Generate Summary"
							>
								<Wand2 className="h-4 w-4" />
							</Button>

							<Button
								variant="ghost"
								size="icon"
								onClick={() => onSelectChat?.(doc.id)}
								title="Chat with Document"
							>
								<MessageSquare className="h-4 w-4" />
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="text-destructive"
								onClick={() => deleteMutation.mutate({ id: doc.id })}
								disabled={deleteMutation.isPending}
								title="Delete"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				))}
				{documents?.length === 0 && (
					<p className="text-sm text-center text-muted-foreground p-8 border border-dashed rounded-lg">
						No documents uploaded yet.
					</p>
				)}
			</div>
		</div>
	);
}
