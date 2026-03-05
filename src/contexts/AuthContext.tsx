import type { Session, User } from "@supabase/supabase-js";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "#/lib/supabase";
import { authStore } from "#/lib/auth-store";
import type { Profile } from "#/types/auth";

interface AuthContextType {
	session: Session | null;
	user: User | null;
	profile: Profile | null;
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
	const [state, setState] = useState(authStore.state);
	const { session, user, profile, isLoading } = state;

	const fetchProfile = async (userId: string) => {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (error) {
			console.error("Error fetching profile:", error);
			authStore.setState((state) => ({ ...state, profile: null }));
		} else {
			authStore.setState((state) => ({
				...state,
				profile: data as Profile,
			}));
		}
	};

	useEffect(() => {
		const unsubStore = authStore.subscribe(() => {
			setState(authStore.state);
		});

		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			const currentUser = session?.user ?? null;

			authStore.setState((state) => ({
				...state,
				session,
				user: currentUser,
			}));

			if (currentUser) {
				fetchProfile(currentUser.id).finally(() => {
					authStore.setState((state) => ({ ...state, isLoading: false }));
				});
			} else {
				authStore.setState((state) => ({ ...state, isLoading: false }));
			}
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			const currentUser = session?.user ?? null;

			if (currentUser) {
				authStore.setState((state) => ({
					...state,
					session,
					user: currentUser,
					isLoading: true,
				}));
				await fetchProfile(currentUser.id);
				authStore.setState((state) => ({ ...state, isLoading: false }));
			} else {
				authStore.setState((state) => ({
					...state,
					session: null,
					user: null,
					profile: null,
					isLoading: false,
				}));
			}
		});

		return () => {
			unsubStore();
			subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				session,
				user,
				profile,
				isApproved: profile?.is_approved ?? false,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
