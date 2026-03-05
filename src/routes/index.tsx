import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	CheckCircle2,
	Clock,
	FolderKanban,
	LayoutDashboard,
	TrendingUp,
	ShieldAlert,
	LogOut,
} from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { useAuth } from "#/contexts/AuthContext";
import { trpc } from "#/lib/trpc";
import { logoutFn } from "#/server/auth";

export const Route = createFileRoute("/")({ component: App });

function StatsCard({ title, value, icon: Icon, color }: any) {
	return (
		<div className="p-6 border rounded-2xl bg-card shadow-sm space-y-2">
			<div className={`p-2 w-fit rounded-lg ${color} bg-opacity-10 mb-2`}>
				<Icon size={20} className={color.replace("bg-", "text-")} />
			</div>
			<p className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
				{title}
			</p>
			<p className="text-3xl font-bold">{value}</p>
		</div>
	);
}

function App() {
	const { user, isApproved, isLoading: authLoading } = useAuth();

	const { data: projects, isLoading: projectsLoading } =
		trpc.projects.list.useQuery(undefined, {
			enabled: !!user && isApproved,
		});

	if (authLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="flex flex-col items-center gap-4">
					<div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<p className="text-muted-foreground animate-pulse font-medium">
						Checking authorization...
					</p>
				</div>
			</div>
		);
	}

	// Handle authenticated but NOT approved state
	if (user && !isApproved) {
		return (
			<main className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[70vh]">
				<div className="max-w-md w-full text-center space-y-8 p-10 bg-card border rounded-3xl shadow-xl animate-in zoom-in duration-500">
					<div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center ring-8 ring-orange-50 dark:ring-orange-900/10">
						<ShieldAlert size={40} />
					</div>
					<div className="space-y-3">
						<h1 className="text-3xl font-bold tracking-tight">
							Approval Pending
						</h1>
						<p className="text-muted-foreground leading-relaxed">
							Welcome to Urbanistica, <span className="font-semibold text-foreground">{user.email}</span>! <br />
							Your account has been created successfully, but it requires manual approval by an administrator before you can access the dashboard.
						</p>
					</div>
					<div className="pt-4 space-y-4">
						<div className="p-4 bg-muted/50 rounded-2xl text-sm text-muted-foreground border border-dashed">
							We'll review your request shortly. Please check back later.
						</div>
						<Button
							variant="outline"
							className="w-full h-12 rounded-xl group"
							onClick={async () => {
								await logoutFn();
								window.location.reload();
							}}
						>
							<LogOut size={18} className="mr-2 group-hover:text-destructive transition-colors" />
							Sign Out
						</Button>
					</div>
				</div>
			</main>
		);
	}

	if (projectsLoading && user && isApproved) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="flex flex-col items-center gap-4">
					<div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<p className="text-muted-foreground animate-pulse font-medium">
						Initializing Dashboard...
					</p>
				</div>
			</div>
		);
	}

	const activeProjects =
		projects?.filter((p) => p.status === "active").length || 0;
	const completedProjects =
		projects?.filter((p) => p.status === "completed").length || 0;
	const leads = projects?.filter((p) => p.status === "lead").length || 0;

	return (
		<main className="max-w-7xl mx-auto p-6 space-y-10 animate-in fade-in duration-700">
			<section className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 shadow-2xl shadow-primary/20">
				<div className="relative z-10 space-y-6 max-w-2xl">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider">
						<LayoutDashboard size={14} />
						Management Portal
					</div>
					<h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
						Urbanistica <br /> Dashboard
					</h1>
					<p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
						Centralized platform for urban planning, architectural design, and
						project intelligence.
					</p>
					<div className="flex flex-wrap gap-4 pt-4">
						{user ? (
							<Link to={"/projects" as any}>
								<Button
									size="lg"
									variant="secondary"
									className="font-bold shadow-lg"
								>
									Go to Projects Hub <ArrowRight size={18} className="ml-2" />
								</Button>
							</Link>
						) : (
							<Link to={"/login" as any}>
								<Button size="lg" variant="secondary" className="font-bold">
									Get Started <ArrowRight size={18} className="ml-2" />
								</Button>
							</Link>
						)}
					</div>
				</div>

				{/* Abstract background shapes */}
				<div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
				<div className="absolute right-20 bottom-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
			</section>

			{user && isApproved && (
				<>
					<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						<StatsCard
							title="Total Projects"
							value={projects?.length || 0}
							icon={FolderKanban}
							color="bg-primary"
						/>
						<StatsCard
							title="Active Now"
							value={activeProjects}
							icon={TrendingUp}
							color="bg-blue-500"
						/>
						<StatsCard
							title="Completed"
							value={completedProjects}
							icon={CheckCircle2}
							color="bg-green-500"
						/>
						<StatsCard
							title="New Leads"
							value={leads}
							icon={Clock}
							color="bg-orange-500"
						/>
					</section>

					<section className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold tracking-tight">
								Recent Activity
							</h2>
							<Link
								to={"/projects" as any}
								className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
							>
								View all <ArrowRight size={14} />
							</Link>
						</div>

						<div className="grid gap-4">
							{projects?.slice(0, 3).map((project) => (
								<Link
									key={project.id}
									to={"/projects/$projectId" as any}
									params={{ projectId: project.id.toString() } as any}
									className="flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary/50 transition-all shadow-sm"
								>
									<div className="flex items-center gap-4">
										<div className="p-2 rounded-lg bg-muted">
											<FolderKanban size={20} className="text-primary" />
										</div>
										<div>
											<p className="font-semibold">{project.name}</p>
											<p className="text-xs text-muted-foreground">
												{project.client?.name || "Private"}
											</p>
										</div>
									</div>
									<Badge variant="outline" className="capitalize">
										{project.status}
									</Badge>
								</Link>
							))}
							{(!projects || projects.length === 0) && (
								<div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">
									No projects to display yet.
								</div>
							)}
						</div>
					</section>
				</>
			)}
		</main>
	);
}
