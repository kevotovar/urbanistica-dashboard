import { createFileRoute } from "@tanstack/react-router";
import {
	Building2,
	Loader2,
	Mail,
	Phone,
	Plus,
	Search,
	Trash2,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { CreateClientForm } from "#/components/clients/CreateClientForm";
import { Button } from "#/components/ui/button";
import { trpc } from "#/lib/trpc";

export const Route = createFileRoute("/clients/" as any)({
	component: ClientsPage,
});

function ClientsPage() {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [search, setSearch] = useState("");
	const { data: clients, isLoading } = trpc.clients.list.useQuery();
	const utils = trpc.useUtils();

	const deleteMutation = trpc.clients.delete.useMutation({
		onSuccess: () => {
			utils.clients.list.invalidate();
		},
	});

	const filteredClients = clients?.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.company?.toLowerCase().includes(search.toLowerCase()),
	);

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
						Clients Directory
					</h1>
					<p className="text-muted-foreground">
						Manage your relationships and project contacts.
					</p>
				</div>
				{!showCreateForm && (
					<Button onClick={() => setShowCreateForm(true)}>
						<Plus size={18} className="mr-2" /> New Client
					</Button>
				)}
			</div>

			{showCreateForm && (
				<div className="border-2 border-primary/20 bg-muted/5 rounded-2xl p-6 relative">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-primary">
							Register New Client
						</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowCreateForm(false)}
						>
							<X size={18} />
						</Button>
					</div>
					<CreateClientForm onSuccess={() => setShowCreateForm(false)} />
				</div>
			)}

			<div className="relative">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
					size={18}
				/>
				<input
					type="text"
					placeholder="Search by name or company..."
					className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredClients?.map((client) => (
					<div
						key={client.id}
						className="group p-6 border rounded-2xl bg-card hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between"
					>
						<div className="space-y-4">
							<div className="flex justify-between items-start">
								<div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
									{client.name.charAt(0)}
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={() => {
										if (
											confirm("Are you sure you want to delete this client?")
										) {
											deleteMutation.mutate({ id: client.id });
										}
									}}
								>
									<Trash2 size={16} />
								</Button>
							</div>

							<div>
								<h3 className="font-bold text-xl leading-none mb-1">
									{client.name}
								</h3>
								{client.company && (
									<p className="text-primary text-sm font-medium flex items-center gap-1">
										<Building2 size={14} /> {client.company}
									</p>
								)}
							</div>

							<div className="space-y-2 pt-2 text-sm text-muted-foreground">
								{client.email && (
									<p className="flex items-center gap-2">
										<Mail size={14} className="shrink-0" /> {client.email}
									</p>
								)}
								{client.phone && (
									<p className="flex items-center gap-2">
										<Phone size={14} className="shrink-0" /> {client.phone}
									</p>
								)}
							</div>
						</div>

						<div className="mt-6 pt-4 border-t border-dashed">
							<Button
								variant="outline"
								size="sm"
								className="w-full text-xs font-semibold"
							>
								View Project History
							</Button>
						</div>
					</div>
				))}

				{filteredClients?.length === 0 && (
					<div className="col-span-full text-center py-20 bg-muted/5 border-2 border-dashed rounded-2xl">
						<Users
							size={48}
							className="mx-auto text-muted-foreground opacity-20 mb-4"
						/>
						<p className="text-muted-foreground">
							No clients match your search.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
