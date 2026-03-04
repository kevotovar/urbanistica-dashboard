import { createFileRoute } from "@tanstack/react-router";
import {
	Briefcase,
	Compass,
	Loader2,
	Mail,
	Palette,
	Plus,
	ShieldCheck,
	User,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { CreatePersonnelForm } from "#/components/personnel/CreatePersonnelForm";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { trpc } from "#/lib/trpc";

export const Route = createFileRoute("/personnel/" as any)({
	component: PersonnelPage,
});

function getRoleIcon(role: string | null) {
	switch (role) {
		case "admin":
			return <ShieldCheck size={16} className="text-red-500" />;
		case "architect":
			return <Compass size={16} className="text-blue-500" />;
		case "designer":
			return <Palette size={16} className="text-purple-500" />;
		default:
			return <Briefcase size={16} className="text-muted-foreground" />;
	}
}

function PersonnelPage() {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const { data: staff, isLoading } = trpc.personnel.list.useQuery();

	if (isLoading)
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="animate-spin text-primary" size={32} />
			</div>
		);

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Personnel Directory
					</h1>
					<p className="text-muted-foreground">
						Manage your internal team and external collaborators.
					</p>
				</div>
				{!showCreateForm && (
					<Button onClick={() => setShowCreateForm(true)}>
						<Plus size={18} className="mr-2" /> Add Staff
					</Button>
				)}
			</div>

			{showCreateForm && (
				<div className="border-2 border-primary/20 bg-muted/5 rounded-2xl p-6 relative">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-primary">Add Team Member</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowCreateForm(false)}
						>
							<X size={18} />
						</Button>
					</div>
					<CreatePersonnelForm onSuccess={() => setShowCreateForm(false)} />
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{staff?.map((person) => (
					<div
						key={person.id}
						className="p-6 border rounded-2xl bg-card hover:shadow-md transition-all text-center space-y-4"
					>
						<div className="mx-auto h-20 w-20 rounded-full bg-muted border-4 border-background shadow-sm overflow-hidden flex items-center justify-center">
							{person.avatarUrl ? (
								<img
									src={person.avatarUrl}
									alt={person.name}
									className="h-full w-full object-cover"
								/>
							) : (
								<User size={40} className="text-muted-foreground opacity-20" />
							)}
						</div>

						<div>
							<h3 className="font-bold text-lg leading-none mb-1">
								{person.name}
							</h3>
							<div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
								{getRoleIcon(person.role)}
								{person.role}
							</div>
						</div>

						<div className="pt-2">
							<Badge
								variant="outline"
								className="text-[10px] lowercase flex items-center gap-1 w-fit mx-auto"
							>
								<Mail size={10} /> {person.email}
							</Badge>
						</div>

						<div className="pt-4 flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								className="flex-1 text-[10px] font-bold h-8 uppercase"
							>
								Profile
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="flex-1 text-[10px] font-bold h-8 uppercase"
							>
								Projects
							</Button>
						</div>
					</div>
				))}

				{staff?.length === 0 && !showCreateForm && (
					<div className="col-span-full text-center py-20 bg-muted/5 border-2 border-dashed rounded-2xl">
						<Users
							size={48}
							className="mx-auto text-muted-foreground opacity-20 mb-4"
						/>
						<p className="text-muted-foreground">
							Your personnel directory is empty.
						</p>
						<Button variant="link" onClick={() => setShowCreateForm(true)}>
							Add your first team member
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
