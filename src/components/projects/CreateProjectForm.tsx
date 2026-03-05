import { useNavigate } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { trpc } from "#/lib/trpc";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export function CreateProjectForm({ onSuccess }: { onSuccess?: () => void }) {
	const navigate = useNavigate();
	const utils = trpc.useUtils();
	const { data: clients } = trpc.clients.list.useQuery();

	const createMutation = trpc.projects.create.useMutation({
		onSuccess: (project) => {
			utils.projects.list.invalidate();
			onSuccess?.();
			navigate({
				to: "/projects/$projectId" as any,
				params: { projectId: project.id.toString() } as any,
			});
		},
	});

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		clientId: "",
		status: "lead" as "lead" | "active" | "completed" | "on_hold" | "cancelled",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate({
			name: formData.name,
			description: formData.description,
			clientId: formData.clientId ? parseInt(formData.clientId, 10) : undefined,
			status: formData.status,
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300"
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Project Name</Label>
					<Input
						id="name"
						placeholder="e.g., Downtown Urban Plaza"
						value={formData.name}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, name: e.target.value }))
						}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="clientId">Client</Label>
					<Select
						value={formData.clientId}
						onValueChange={(val) =>
							setFormData((prev) => ({ ...prev, clientId: val }))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a client (optional)" />
						</SelectTrigger>
						<SelectContent>
							{clients?.map((client) => (
								<SelectItem key={client.id} value={client.id.toString()}>
									{client.name}
								</SelectItem>
							))}
							{clients?.length === 0 && (
								<div className="p-2 text-xs text-center text-muted-foreground">
									No clients found
								</div>
							)}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="status">Initial Status</Label>
					<Select
						value={formData.status}
						onValueChange={(val: any) =>
							setFormData((prev) => ({ ...prev, status: val }))
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="lead">Lead</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="on_hold">On Hold</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						placeholder="Project scope and initial notes..."
						value={formData.description}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, description: e.target.value }))
						}
						rows={4}
					/>
				</div>
			</div>

			<div className="flex gap-3 pt-2">
				<Button
					type="submit"
					className="flex-1"
					disabled={createMutation.isPending}
				>
					{createMutation.isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" /> Create Project
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
