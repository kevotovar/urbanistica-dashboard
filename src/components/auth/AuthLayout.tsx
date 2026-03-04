import type React from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
			<div className="w-full max-w-md space-y-8 bg-background p-8 rounded-2xl shadow-xl border">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold tracking-tight text-primary">
						{title}
					</h1>
					<p className="text-muted-foreground">{description}</p>
				</div>
				{children}
			</div>
		</div>
	);
}
