import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "#/components/auth/AuthLayout";
import { LoginForm } from "#/components/auth/LoginForm";
import { getSessionFn } from "#/server/auth";

export const Route = createFileRoute("/login" as any)({
	beforeLoad: async () => {
		const session = await getSessionFn();
		if (session) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	return (
		<AuthLayout
			title="Welcome Back"
			description="Enter your credentials to access your dashboard"
		>
			<LoginForm />
		</AuthLayout>
	);
}
