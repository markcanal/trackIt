import { createAuthClient } from 'better-auth/svelte';
import { magicLinkClient } from 'better-auth/client/plugins';
import { anonymousClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BETTER_AUTH_URL ?? 'http://localhost:5173',
	plugins: [magicLinkClient(), anonymousClient()]
});

export const { signIn, signUp, signOut, useSession } = authClient;
