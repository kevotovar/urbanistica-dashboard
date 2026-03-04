import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "#/components/auth/AuthLayout";
import { SignupForm } from "#/components/auth/SignupForm";
import { getSessionFn } from "#/server/auth";

export const Route = createFileRoute("/signup" as any)({
	beforeLoad: async () => {
		const session = await getSessionFn();
		if (session) {
			throw redirect({ to: "/" });
		}
	},
	component: SignupPage,
});

function SignupPage() {
	return (
		<AuthLayout
			title="Create Account"
			description="Join Urbanistica to manage your urban planning projects"
		>
			<SignupForm />
		</AuthLayout>
	);
}
