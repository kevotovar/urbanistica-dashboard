import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	CheckCircle2,
	ChevronRight,
	Clock,
	FolderKanban,
	Loader2,
	Plus,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { CreateProjectForm } from "#/components/projects/CreateProjectForm";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { trpc } from "#/lib/trpc";

export const Route = createFileRoute("/projects/" as any)({
	component: ProjectsPage,
});

function getStatusConfig(status: string | null) {
	switch (status) {
		case "active":
			return {
				variant: "default",
				icon: <Clock size={12} className="mr-1" />,
				label: "Active",
			};
		case "completed":
			return {
				variant: "success",
				icon: <CheckCircle2 size={12} className="mr-1" />,
				label: "Completed",
			};
		case "lead":
			return {
				variant: "secondary",
				icon: <AlertCircle size={12} className="mr-1" />,
				label: "Lead",
			};
		case "on_hold":
			return {
				variant: "warning",
				icon: <Clock size={12} className="mr-1" />,
				label: "On Hold",
			};
		default:
			return { variant: "outline", icon: null, label: status || "Unknown" };
	}
}

function ProjectsPage() {
	const { data: projects, isLoading } = trpc.projects.list.useQuery();
	const [showCreateForm, setShowCreateForm] = useState(false);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="animate-spin text-primary" size={32} />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Projects Hub</h1>
					<p className="text-muted-foreground">
						Manage and track all urban planning and design projects.
					</p>
				</div>
				{!showCreateForm && (
					<Button className="shrink-0" onClick={() => setShowCreateForm(true)}>
						<Plus size={18} className="mr-2" /> New Project
					</Button>
				)}
			</div>

			{showCreateForm && (
				<div className="border-2 border-primary/20 bg-muted/5 rounded-2xl p-6 relative">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold">Register New Project</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowCreateForm(false)}
						>
							<X size={18} />
						</Button>
					</div>
					<CreateProjectForm onSuccess={() => setShowCreateForm(false)} />
				</div>
			)}

			<div className="grid gap-4">
				{projects?.map((project) => {
					const config = getStatusConfig(project.status);
					return (
						<Link
							key={project.id}
							to={"/projects/$projectId" as any}
							params={{ projectId: project.id.toString() } as any}
							className="group flex items-center justify-between p-5 border rounded-xl bg-card hover:border-primary/50 hover:shadow-md transition-all"
						>
							<div className="flex items-start gap-4">
								<div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
									<FolderKanban size={24} />
								</div>
								<div className="space-y-1">
									<h3 className="font-semibold text-lg leading-none">
										{project.name}
									</h3>
									<div className="flex items-center gap-3 text-sm text-muted-foreground">
										<span className="flex items-center">
											<Users size={14} className="mr-1" />
											{project.client?.name || "Private Client"}
										</span>
										<span className="w-1 h-1 rounded-full bg-border" />
										<span>
											Created{" "}
											{project.createdAt
												? new Date(project.createdAt).toLocaleDateString()
												: "—"}
										</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-6">
								<Badge
									variant={config.variant as any}
									className="hidden sm:flex"
								>
									{config.icon}
									{config.label}
								</Badge>
								<ChevronRight
									className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
									size={20}
								/>
							</div>
						</Link>
					);
				})}

				{projects?.length === 0 && !showCreateForm && (
					<div className="text-center py-20 border border-dashed rounded-2xl bg-muted/5">
						<div className="bg-muted p-4 rounded-full w-fit mx-auto mb-4">
							<FolderKanban
								size={32}
								className="text-muted-foreground opacity-50"
							/>
						</div>
						<h3 className="text-lg font-medium">No projects found</h3>
						<p className="text-muted-foreground mb-6">
							Start by creating your first project registry.
						</p>
						<Button variant="outline" onClick={() => setShowCreateForm(true)}>
							<Plus size={18} className="mr-2" /> Create Project
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
