import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Banknote,
	Clock,
	FileText,
	History,
	LayoutDashboard,
	Loader2,
	MessageSquarePlus,
	User,
} from "lucide-react";
import { useState } from "react";
import { ChatInterface } from "#/components/chat/ChatInterface";
import { DocumentList } from "#/components/documents/DocumentList";
import { DocumentUpload } from "#/components/documents/DocumentUpload";
import { AddTransactionForm } from "#/components/projects/AddTransactionForm";
import { FinancialStats } from "#/components/projects/FinancialStats";
import { LogActivityForm } from "#/components/projects/LogActivityForm";
import { Badge } from "#/components/ui/badge";
import { trpc } from "#/lib/trpc";

export const Route = createFileRoute("/projects/$projectId" as any)({
	component: ProjectDetails,
});

function ProjectDetails() {
	const { projectId } = Route.useParams() as any;
	const id = parseInt(projectId, 10);
	const [activeChatDocId, setActiveChatDocId] = useState<number | null>(null);

	const { data: project, isLoading } = trpc.projects.getById.useQuery({ id });
	const { data: transactions } = trpc.financials.listByProject.useQuery({
		projectId: id,
	});
	const { data: activities } = trpc.activities.listByProject.useQuery({
		projectId: id,
	});

	if (isLoading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="animate-spin text-primary" />
			</div>
		);

	if (!project) return <div className="p-8 text-center">Project not found</div>;

	const formatCurrency = (val: string | number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(Number(val));

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
				<div className="flex items-center gap-4">
					<Link
						to={"/projects" as any}
						className="p-2 hover:bg-muted rounded-full transition-colors border shadow-sm"
					>
						<ArrowLeft size={20} />
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							{project.name}
						</h1>
						<p className="text-muted-foreground flex items-center gap-2">
							<span className="font-medium text-primary">
								{project.client?.name || "Private Client"}
							</span>
							<span className="text-border">|</span>
							<span className="capitalize">{project.status}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Financial Section */}
			<section className="space-y-6">
				<div className="flex items-center gap-2 text-lg font-semibold">
					<LayoutDashboard size={20} className="text-primary" />
					<h2>Financial Dashboard</h2>
				</div>
				<FinancialStats projectId={id} />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-1">
						<AddTransactionForm projectId={id} />
					</div>
					<div className="lg:col-span-2 border rounded-xl bg-card overflow-hidden shadow-sm">
						<div className="p-4 border-b bg-muted/30 flex items-center gap-2">
							<Banknote size={16} className="text-primary" />
							<h3 className="font-semibold text-sm">Recent Transactions</h3>
						</div>
						<div className="divide-y max-h-[300px] overflow-y-auto">
							{transactions?.map((t) => (
								<div
									key={t.id}
									className="p-3 flex items-center justify-between text-sm hover:bg-muted/20"
								>
									<div>
										<p className="font-medium">{t.category}</p>
										<p className="text-xs text-muted-foreground">
											{t.description || "No description"}
										</p>
									</div>
									<div className="text-right">
										<p
											className={
												t.type === "income"
													? "text-green-600 font-bold"
													: "text-red-600 font-bold"
											}
										>
											{t.type === "income" ? "+" : "-"}
											{formatCurrency(t.amount)}
										</p>
										<p className="text-[10px] text-muted-foreground">
											{new Date(t.date).toLocaleDateString()}
										</p>
									</div>
								</div>
							))}
							{transactions?.length === 0 && (
								<p className="p-8 text-center text-muted-foreground text-sm italic">
									No transactions recorded.
								</p>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Activities Section */}
			<section className="space-y-6 pt-4">
				<div className="flex items-center gap-2 text-lg font-semibold">
					<History size={20} className="text-primary" />
					<h2>Activity Log</h2>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-1">
						<LogActivityForm projectId={id} />
					</div>
					<div className="lg:col-span-2 border rounded-xl bg-card overflow-hidden shadow-sm">
						<div className="p-4 border-b bg-muted/30 flex items-center gap-2">
							<Clock size={16} className="text-primary" />
							<h3 className="font-semibold text-sm">Work History</h3>
						</div>
						<div className="divide-y max-h-[300px] overflow-y-auto">
							{activities?.map((a) => (
								<div key={a.id} className="p-4 flex gap-4 hover:bg-muted/20">
									<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border">
										<User size={18} className="text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between gap-2 mb-1">
											<p className="font-semibold text-sm truncate">
												{a.personnel?.name || "Unknown"}
											</p>
											<Badge
												variant="secondary"
												className="text-[10px] py-0 h-5"
											>
												{a.hours} hrs
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{a.description}
										</p>
										<p className="text-[10px] text-muted-foreground mt-2">
											{new Date(a.date).toLocaleDateString()}
										</p>
									</div>
								</div>
							))}
							{activities?.length === 0 && (
								<p className="p-8 text-center text-muted-foreground text-sm italic">
									No activities logged yet.
								</p>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Intelligence Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
				<div className="lg:col-span-1 space-y-8">
					<section className="space-y-4">
						<div className="flex items-center gap-2 text-lg font-semibold">
							<FileText size={20} className="text-primary" />
							<h2>Documents</h2>
						</div>
						<DocumentUpload projectId={id} />
						<DocumentList
							projectId={id}
							onSelectChat={(docId) => setActiveChatDocId(docId)}
						/>
					</section>
				</div>

				<div className="lg:col-span-2">
					{activeChatDocId ? (
						<section className="space-y-4 h-full">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-lg font-semibold">
									<MessageSquarePlus size={20} className="text-primary" />
									<h2>AI Contextual Chat</h2>
								</div>
								<button
									type="button"
									onClick={() => setActiveChatDocId(null)}
									className="text-xs text-muted-foreground hover:text-primary underline font-medium"
								>
									Close Assistant
								</button>
							</div>
							<ChatInterface documentId={activeChatDocId} />
						</section>
					) : (
						<div className="h-full min-h-[500px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5 p-12 text-center group hover:bg-muted/10 transition-colors">
							<div className="bg-muted p-6 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-inner">
								<MessageSquarePlus size={48} className="opacity-20" />
							</div>
							<h3 className="font-bold text-xl text-foreground mb-2 font-mono tracking-tighter">
								AI AGENT
							</h3>
							<p className="text-sm max-w-sm">
								Select any project document to start a conversation with the AI.
								It will analyze the content to help you make better decisions.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
