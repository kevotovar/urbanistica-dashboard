import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "#/contexts/AuthContext";
import { logoutFn } from "#/server/auth";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

export default function Header() {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logoutFn();
		navigate({ to: "/login" as any });
	};

	return (
		<header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
			<nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
				<h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
					<Link
						to="/"
						className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
					>
						<span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
						Urbanistica
					</Link>
				</h2>

				<div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2 order-2 sm:order-3">
					{!isLoading &&
						(user ? (
							<div className="flex items-center gap-3">
								<span className="hidden md:block text-xs text-muted-foreground">
									{user.email}
								</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleLogout}
									className="text-muted-foreground hover:text-primary"
								>
									<LogOut className="h-4 w-4 mr-2" />
									Logout
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<Link to={"/login" as any}>
									<Button variant="ghost" size="sm">
										Login
									</Button>
								</Link>
								<Link to={"/signup" as any}>
									<Button size="sm">Sign Up</Button>
								</Link>
							</div>
						))}
					<ThemeToggle />
				</div>

				<div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
					<Link
						to="/"
						className="nav-link"
						activeProps={{ className: "nav-link is-active" }}
					>
						Home
					</Link>
					{user && (
						<>
							<Link
								to={"/projects" as any}
								className="nav-link"
								activeProps={{ className: "nav-link is-active" }}
							>
								Projects
							</Link>
							<Link
								to={"/clients" as any}
								className="nav-link"
								activeProps={{ className: "nav-link is-active" }}
							>
								Clients
							</Link>
							<Link
								to={"/personnel" as any}
								className="nav-link"
								activeProps={{ className: "nav-link is-active" }}
							>
								Personnel
							</Link>
						</>
					)}
					<Link
						to="/about"
						className="nav-link"
						activeProps={{ className: "nav-link is-active" }}
					>
						About
					</Link>
				</div>
			</nav>
		</header>
	);
}
