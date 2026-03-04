import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { signupFn } from "#/server/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function SignupForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await signupFn({ data: { email, password } });
			navigate({ to: "/login" as any });
		} catch (err: any) {
			setError(err.message || "Signup failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSignup} className="space-y-4">
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
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={isLoading}
					minLength={6}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirm Password</Label>
				<Input
					id="confirmPassword"
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
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
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
						account...
					</>
				) : (
					<>
						<UserPlus className="mr-2 h-4 w-4" /> Create Account
					</>
				)}
			</Button>

			<p className="text-center text-sm text-muted-foreground pt-4">
				Already have an account?{" "}
				<Link
					to={"/login" as any}
					className="text-primary hover:underline font-semibold"
				>
					Sign in
				</Link>
			</p>
		</form>
	);
}
