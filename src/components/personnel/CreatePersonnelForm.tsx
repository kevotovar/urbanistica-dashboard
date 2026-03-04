import { Loader2, UserPlus } from "lucide-react";
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

export function CreatePersonnelForm({ onSuccess }: { onSuccess?: () => void }) {
	const utils = trpc.useUtils();
	const createMutation = trpc.personnel.create.useMutation({
		onSuccess: () => {
			utils.personnel.list.invalidate();
			setFormData({ name: "", email: "", role: "architect", avatarUrl: "" });
			onSuccess?.();
		},
	});

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "architect" as
			| "admin"
			| "architect"
			| "designer"
			| "legal"
			| "external",
		avatarUrl: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="staff-name">Full Name</Label>
					<Input
						id="staff-name"
						placeholder="e.g., Jane Doe"
						value={formData.name}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, name: e.target.value }))
						}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="staff-email">Work Email</Label>
					<Input
						id="staff-email"
						type="email"
						placeholder="jane@urbanistica.com"
						value={formData.email}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, email: e.target.value }))
						}
						required
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="staff-role">Primary Role</Label>
					<Select
						value={formData.role}
						onValueChange={(val: any) =>
							setFormData((prev) => ({ ...prev, role: val }))
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="admin">Administrator</SelectItem>
							<SelectItem value="architect">Architect</SelectItem>
							<SelectItem value="designer">Designer</SelectItem>
							<SelectItem value="legal">Legal Counsel</SelectItem>
							<SelectItem value="external">External Collaborator</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="staff-avatar">Avatar URL (Optional)</Label>
					<Input
						id="staff-avatar"
						placeholder="https://..."
						value={formData.avatarUrl}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }))
						}
					/>
				</div>
			</div>

			<Button
				type="submit"
				className="w-full"
				disabled={createMutation.isPending}
			>
				{createMutation.isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Staff...
					</>
				) : (
					<>
						<UserPlus className="mr-2 h-4 w-4" /> Add to Personnel
					</>
				)}
			</Button>
		</form>
	);
}
