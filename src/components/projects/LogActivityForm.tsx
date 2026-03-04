import { ClipboardCheck, Clock, Loader2 } from "lucide-react";
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

interface LogActivityFormProps {
	projectId: number;
	onSuccess?: () => void;
}

export function LogActivityForm({
	projectId,
	onSuccess,
}: LogActivityFormProps) {
	const utils = trpc.useUtils();
	const { data: personnel } = trpc.personnel.list.useQuery();

	const [formData, setFormData] = useState({
		personnelId: "",
		description: "",
		hours: "1.0",
	});

	const createMutation = trpc.activities.create.useMutation({
		onSuccess: () => {
			utils.activities.listByProject.invalidate({ projectId });
			setFormData((prev) => ({ ...prev, description: "", hours: "1.0" }));
			onSuccess?.();
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.personnelId) return;

		createMutation.mutate({
			projectId,
			personnelId: parseInt(formData.personnelId),
			description: formData.description,
			hours: formData.hours,
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 p-4 border rounded-xl bg-card shadow-sm"
		>
			<div className="flex items-center gap-2 font-semibold text-sm mb-2">
				<ClipboardCheck size={16} className="text-primary" />
				<h4>Log Activity</h4>
			</div>

			<div className="space-y-2">
				<Label htmlFor="personnelId">Personnel</Label>
				<Select
					value={formData.personnelId}
					onValueChange={(val) =>
						setFormData((prev) => ({ ...prev, personnelId: val }))
					}
				>
					<SelectTrigger className="h-9">
						<SelectValue placeholder="Who performed this work?" />
					</SelectTrigger>
					<SelectContent>
						{personnel?.map((p) => (
							<SelectItem key={p.id} value={p.id.toString()}>
								{p.name} ({p.role})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<div className="col-span-2 space-y-2">
					<Label htmlFor="description">Activity Description</Label>
					<Input
						id="description"
						placeholder="e.g., Initial site analysis..."
						className="h-9"
						value={formData.description}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, description: e.target.value }))
						}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="hours">Hours</Label>
					<div className="relative">
						<Input
							id="hours"
							type="number"
							step="0.25"
							className="h-9 pr-8"
							value={formData.hours}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, hours: e.target.value }))
							}
							required
						/>
						<Clock
							size={12}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						/>
					</div>
				</div>
			</div>

			<Button
				type="submit"
				className="w-full h-9 mt-2"
				disabled={createMutation.isPending || !formData.personnelId}
			>
				{createMutation.isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging...
					</>
				) : (
					"Log Activity"
				)}
			</Button>
		</form>
	);
}
