import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { trpc } from "#/lib/trpc";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function CreateClientForm({ onSuccess }: { onSuccess?: () => void }) {
	const utils = trpc.useUtils();
	const createMutation = trpc.clients.create.useMutation({
		onSuccess: () => {
			utils.clients.list.invalidate();
			setFormData({
				name: "",
				email: "",
				phone: "",
				company: "",
				address: "",
				notes: "",
			});
			onSuccess?.();
		},
	});

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		company: "",
		address: "",
		notes: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="client-name">Full Name</Label>
					<Input
						id="client-name"
						placeholder="Client or Representative name"
						value={formData.name}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, name: e.target.value }))
						}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="client-email">Email</Label>
					<Input
						id="client-email"
						type="email"
						placeholder="client@example.com"
						value={formData.email}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, email: e.target.value }))
						}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="client-company">Company</Label>
					<Input
						id="client-company"
						placeholder="Company name"
						value={formData.company}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, company: e.target.value }))
						}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="client-phone">Phone</Label>
					<Input
						id="client-phone"
						placeholder="Contact number"
						value={formData.phone}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, phone: e.target.value }))
						}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="client-address">Address</Label>
				<Input
					id="client-address"
					placeholder="Physical or Billing address"
					value={formData.address}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, address: e.target.value }))
					}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="client-notes">Internal Notes</Label>
				<Textarea
					id="client-notes"
					placeholder="Special requirements, history, etc."
					value={formData.notes}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, notes: e.target.value }))
					}
					rows={3}
				/>
			</div>

			<Button
				type="submit"
				className="w-full"
				disabled={createMutation.isPending}
			>
				{createMutation.isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
					</>
				) : (
					<>
						<UserPlus className="mr-2 h-4 w-4" /> Register Client
					</>
				)}
			</Button>
		</form>
	);
}
