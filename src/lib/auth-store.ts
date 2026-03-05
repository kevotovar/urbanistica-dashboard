import { Store } from "@tanstack/store";
import type { Profile } from "#/types/auth";

interface AuthState {
	session: any | null;
	user: any | null;
	profile: Profile | null;
	isLoading: boolean;
}

export const authStore = new Store<AuthState>({
	session: null,
	user: null,
	profile: null,
	isLoading: true,
});
