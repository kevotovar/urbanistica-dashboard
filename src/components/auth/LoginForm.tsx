import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { loginFn } from "#/server/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			await loginFn({ data: { email, password } });
			navigate({ to: "/" as any });
		} catch (err: any) {
			setError(err.message || "Login failed. Please check your credentials.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleLogin} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="name@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={isLoading}
				/>
			</div>
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="password">Password</Label>
				</div>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={isLoading}
				/>
			</div>

			{error && (
				<p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
					{error}
				</p>
			)}

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
					</>
				) : (
					<>
						<LogIn className="mr-2 h-4 w-4" /> Sign In
					</>
				)}
			</Button>

			<p className="text-center text-sm text-muted-foreground pt-4">
				Don't have an account?{" "}
				<Link
					to={"/signup" as any}
					className="text-primary hover:underline font-semibold"
				>
					Sign up
				</Link>
			</p>
		</form>
	);
}
