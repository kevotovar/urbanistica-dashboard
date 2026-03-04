import {
	ArrowDownCircle,
	ArrowUpCircle,
	Loader2,
	PlusCircle,
} from "lucide-react";
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

interface AddTransactionFormProps {
	projectId: number;
	onSuccess?: () => void;
}

export function AddTransactionForm({
	projectId,
	onSuccess,
}: AddTransactionFormProps) {
	const utils = trpc.useUtils();
	const [formData, setFormData] = useState({
		amount: "",
		type: "expense" as "income" | "expense",
		category: "",
		description: "",
	});

	const createMutation = trpc.financials.create.useMutation({
		onSuccess: () => {
			utils.financials.getProjectStats.invalidate({ projectId });
			utils.financials.listByProject.invalidate({ projectId });
			setFormData({
				amount: "",
				type: "expense",
				category: "",
				description: "",
			});
			onSuccess?.();
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate({
			projectId,
			amount: formData.amount,
			type: formData.type,
			category: formData.category,
			description: formData.description,
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 p-4 border rounded-xl bg-card shadow-sm"
		>
			<div className="flex items-center gap-2 font-semibold text-sm mb-2">
				<PlusCircle size={16} className="text-primary" />
				<h4>Add Transaction</h4>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="type">Type</Label>
					<Select
						value={formData.type}
						onValueChange={(val: any) =>
							setFormData((prev) => ({ ...prev, type: val }))
						}
					>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="income">
								<span className="flex items-center text-green-600 font-medium">
									<ArrowUpCircle size={14} className="mr-2" /> Income
								</span>
							</SelectItem>
							<SelectItem value="expense">
								<span className="flex items-center text-red-600 font-medium">
									<ArrowDownCircle size={14} className="mr-2" /> Expense
								</span>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="amount">Amount (USD)</Label>
					<Input
						id="amount"
						type="number"
						step="0.01"
						placeholder="0.00"
						className="h-9"
						value={formData.amount}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, amount: e.target.value }))
						}
						required
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="category">Category</Label>
				<Input
					id="category"
					placeholder="e.g., Permit Fee, Consultant, Advance"
					className="h-9"
					value={formData.category}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, category: e.target.value }))
					}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Notes (Optional)</Label>
				<Input
					id="description"
					placeholder="Brief description..."
					className="h-9"
					value={formData.description}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, description: e.target.value }))
					}
				/>
			</div>

			<Button
				type="submit"
				className="w-full h-9 mt-2"
				disabled={createMutation.isPending}
			>
				{createMutation.isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
					</>
				) : (
					"Add Transaction"
				)}
			</Button>
		</form>
	);
}
