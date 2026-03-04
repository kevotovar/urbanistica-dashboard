import { ArrowDownCircle, ArrowUpCircle, Loader2, Wallet } from "lucide-react";
import { trpc } from "#/lib/trpc";

interface FinancialStatsProps {
	projectId: number;
}

function LocalCard({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}
		>
			{children}
		</div>
	);
}

export function FinancialStats({ projectId }: FinancialStatsProps) {
	const { data: stats, isLoading } = trpc.financials.getProjectStats.useQuery({
		projectId,
	});

	if (isLoading)
		return (
			<div className="flex justify-center p-4">
				<Loader2 className="animate-spin text-muted-foreground" />
			</div>
		);

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(val);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<LocalCard className="p-4 border-l-4 border-l-green-500">
				<div className="flex items-center gap-3">
					<ArrowUpCircle className="text-green-500" size={20} />
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
							Total Income
						</p>
						<p className="text-2xl font-bold">
							{formatCurrency(stats?.income || 0)}
						</p>
					</div>
				</div>
			</LocalCard>

			<LocalCard className="p-4 border-l-4 border-l-red-500">
				<div className="flex items-center gap-3">
					<ArrowDownCircle className="text-red-500" size={20} />
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
							Total Expenses
						</p>
						<p className="text-2xl font-bold">
							{formatCurrency(stats?.expense || 0)}
						</p>
					</div>
				</div>
			</LocalCard>

			<LocalCard className="p-4 border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/10">
				<div className="flex items-center gap-3">
					<Wallet className="text-blue-500" size={20} />
					<div>
						<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
							Project Balance
						</p>
						<p className="text-2xl font-bold">
							{formatCurrency(stats?.balance || 0)}
						</p>
					</div>
				</div>
			</LocalCard>
		</div>
	);
}
