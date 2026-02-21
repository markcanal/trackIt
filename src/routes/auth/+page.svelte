<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn, signUp, useSession } from '$lib/auth/auth-client.js';

	type Mode = 'login' | 'register' | 'magic';

	let mode = $state<Mode>('login');
	let email = $state('');
	let password = $state('');
	let feedback = $state('');
	let loading = $state(false);

	const session = useSession();

	$effect(() => {
		if ($session.data?.session) goto('/dashboard');
	});

	async function handleSubmit() {
		loading = true;
		feedback = '';
		try {
			if (mode === 'login') {
				await signIn.email({ email, password, callbackURL: '/dashboard' });
			} else if (mode === 'register') {
				await signUp.email({
					email,
					password,
					name: email.split('@')[0],
					callbackURL: '/dashboard'
				});
			} else if (mode === 'magic') {
				await signIn.magicLink({ email });
				feedback = '✅ Check your inbox for the magic link!';
			}
		} catch (e: any) {
			feedback = e?.message ?? 'Something went wrong.';
		} finally {
			loading = false;
		}
	}

	async function handleGoogle() {
		await signIn.social({ provider: 'google', callbackURL: '/dashboard' });
	}

	async function handleGuest() {
		await signIn.anonymous();
		goto('/dashboard');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<div class="w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 shadow-md">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-gray-900">TrackIt 💸</h1>
			<p class="mt-1 text-sm text-gray-500">Your cashflow, simplified.</p>
		</div>

		<!-- Mode Tabs -->
		<div class="flex gap-1 rounded-xl bg-gray-100 p-1">
			{#each ['login', 'register', 'magic'] as Mode[] as m}
				<button
					class="flex-1 cursor-pointer rounded-lg py-1.5 text-sm transition-all
            {mode === m ? 'bg-white font-semibold text-violet-600 shadow' : 'text-gray-500'}"
					onclick={() => {
						mode = m;
						feedback = '';
					}}
				>
					{m === 'login' ? 'Login' : m === 'register' ? 'Register' : '✨ Magic'}
				</button>
			{/each}
		</div>

		<!-- Form -->
		<div class="space-y-3">
			<input
				type="email"
				bind:value={email}
				placeholder="Email"
				class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition
               outline-none focus:ring-2 focus:ring-violet-500"
			/>
			{#if mode !== 'magic'}
				<input
					type="password"
					bind:value={password}
					placeholder="Password"
					class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition
                 outline-none focus:ring-2 focus:ring-violet-500"
				/>
			{/if}

			{#if feedback}
				<p class="text-center text-sm text-violet-600">{feedback}</p>
			{/if}

			<button
				onclick={handleSubmit}
				disabled={loading}
				class="w-full cursor-pointer rounded-xl bg-violet-600 py-3 text-sm font-semibold
               text-white transition hover:bg-violet-700 disabled:opacity-60"
			>
				{loading
					? 'Please wait...'
					: mode === 'magic'
						? 'Send Magic Link'
						: mode === 'login'
							? 'Sign In'
							: 'Create Account'}
			</button>
		</div>

		<div class="flex items-center gap-2 text-xs text-gray-400">
			<div class="h-px flex-1 bg-gray-200"></div>
			or continue with
			<div class="h-px flex-1 bg-gray-200"></div>
		</div>

		<div class="space-y-2">
			<button
				onclick={handleGoogle}
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl
               border border-gray-200 py-3 text-sm font-medium transition hover:bg-gray-50"
			>
				<img
					src="https://www.svgrepo.com/show/475656/google-color.svg"
					class="h-4 w-4"
					alt="Google"
				/>
				Continue with Google
			</button>
			<button
				onclick={handleGuest}
				class="w-full cursor-pointer py-3 text-sm text-gray-400 transition hover:text-gray-600"
			>
				Continue as Guest →
			</button>
		</div>
	</div>
</div>
