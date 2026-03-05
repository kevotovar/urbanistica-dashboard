import type React from "react";
import { createContext, useContext } from "react";
import { useSession } from "#/lib/auth-client";

interface AuthContextType {
	session: any | null;
	user: any | null;
	profile: any | null;
	isApproved: boolean;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	session: null,
	user: null,
	profile: null,
	isApproved: false,
	isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { data, isPending } = useSession();

	const user = data?.user ?? null;
	const session = data?.session ?? null;

	// In Better Auth we can store custom fields like isApproved on the user object.
	const isApproved = user?.isApproved ?? false;

	return (
		<AuthContext.Provider
			value={{
				session,
				user,
				profile: user,
				isApproved: isApproved,
				isLoading: isPending,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
