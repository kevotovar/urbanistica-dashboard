import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { signupFn } from "#/server/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function SignupForm() {
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onChange: z
				.object({
					email: z.string().email("Invalid email address"),
					password: z.string().min(6, "Password must be at least 6 characters"),
					confirmPassword: z.string(),
				})
				.refine((data) => data.password === data.confirmPassword, {
					message: "Passwords do not match",
					path: ["confirmPassword"],
				}),
		},
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				await signupFn({
					data: { email: value.email, password: value.password },
				});
				setIsSuccess(true);
			} catch (err: any) {
				setError(err.message || "Signup failed. Please try again.");
			}
		},
	});

	if (isSuccess) {
		return (
			<div className="space-y-6 text-center py-4 animate-in fade-in zoom-in duration-500">
				<div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center ring-8 ring-green-50 dark:ring-green-900/10">
					<CheckCircle2 size={32} />
				</div>
				<div className="space-y-2">
					<h2 className="text-2xl font-bold">Account Created!</h2>
					<p className="text-muted-foreground">
						Your account has been registered. Before you can sign in, an
						administrator MUST manually approve your access.
					</p>
				</div>
				<div className="pt-4">
					<Link to={"/login" as any}>
						<Button className="w-full h-12 rounded-xl group">
							Return to Login
							<ArrowRight
								size={18}
								className="ml-2 group-hover:translate-x-1 transition-transform"
							/>
						</Button>
					</Link>
				</div>
				<p className="text-xs text-muted-foreground italic">
					You will receive an email once your account is activated.
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field name="email">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Email</Label>
						<Input
							id={field.name}
							name={field.name}
							type="email"
							placeholder="name@example.com"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							required
							disabled={form.state.isSubmitting}
						/>
						{field.state.meta.errors.length > 0 && (
							<em className="text-xs text-destructive">
								{field.state.meta.errors.join(", ")}
							</em>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="password">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Password</Label>
						<Input
							id={field.name}
							name={field.name}
							type="password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							required
							disabled={form.state.isSubmitting}
							minLength={6}
						/>
						{field.state.meta.errors.length > 0 && (
							<em className="text-xs text-destructive">
								{field.state.meta.errors.join(", ")}
							</em>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="confirmPassword">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Confirm Password</Label>
						<Input
							id={field.name}
							name={field.name}
							type="password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							required
							disabled={form.state.isSubmitting}
						/>
						{field.state.meta.errors.length > 0 && (
							<em className="text-xs text-destructive">
								{field.state.meta.errors.join(", ")}
							</em>
						)}
					</div>
				)}
			</form.Field>

			{error && (
				<p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
					{error}
				</p>
			)}

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
			>
				{([canSubmit, isSubmitting]) => (
					<Button
						type="submit"
						className="w-full"
						disabled={!canSubmit || (isSubmitting as boolean)}
					>
						{isSubmitting ? (
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
				)}
			</form.Subscribe>

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
