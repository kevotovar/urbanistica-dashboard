import { Store } from "@tanstack/store";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "#/types/auth";

interface AuthState {
	session: Session | null;
	user: User | null;
	profile: Profile | null;
	isLoading: boolean;
}

export const authStore = new Store<AuthState>({
	session: null,
	user: null,
	profile: null,
	isLoading: true,
});
