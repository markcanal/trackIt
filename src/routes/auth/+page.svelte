<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth/auth-client';

	let mode = $state<'login' | 'register'>('login');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let feedback = $state('');
	let feedbackType = $state<'error' | 'success'>('error');

	async function handleSubmit() {
		loading = true;
		feedback = '';
		try {
			if (mode === 'login') {
				const res = await authClient.signIn.email({ email, password });
				if (res.error) {
					feedback = res.error.message ?? 'Sign in failed';
					feedbackType = 'error';
				} else goto('/dashboard');
			} else {
				const res = await authClient.signUp.email({ email, password, name: email.split('@')[0] });
				if (res.error) {
					feedback = res.error.message ?? 'Sign up failed';
					feedbackType = 'error';
				} else goto('/dashboard');
			}
		} catch {
			feedback = 'Something went wrong';
			feedbackType = 'error';
		}
		loading = false;
	}

	async function handleGoogle() {
		await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
	}

	async function handleMagicLink() {
		if (!email) {
			feedback = 'Enter your email first';
			feedbackType = 'error';
			return;
		}
		loading = true;
		const res = await authClient.signIn.magicLink({ email, callbackURL: '/dashboard' });
		if (res.error) {
			feedback = res.error.message ?? 'Failed';
			feedbackType = 'error';
		} else {
			feedback = '✨ Magic link sent! Check your email';
			feedbackType = 'success';
		}
		loading = false;
	}

	async function handleGuest() {
		loading = true;
		const res = await authClient.signIn.anonymous();
		if (res.error) {
			feedback = res.error.message ?? 'Failed';
			feedbackType = 'error';
		} else goto('/dashboard');
		loading = false;
	}
</script>

<div class="auth-root">
	<!-- Blobs -->
	<div
		class="blob"
		style="width:500px;height:500px;background:#c4b5fd;top:-100px;left:-150px"
	></div>
	<div
		class="blob"
		style="width:400px;height:400px;background:#a5f3fc;bottom:-100px;right:-100px"
	></div>

	<div class="auth-card fade-up">
		<!-- Logo -->
		<div class="auth-logo">
			<div class="logo-icon">💸</div>
			<div>
				<h1>TrackIt</h1>
				<p>Your cashflow, simplified</p>
			</div>
		</div>

		<!-- Tabs -->
		<div class="auth-tabs">
			<button class="tab {mode === 'login' ? 'active' : ''}" onclick={() => (mode = 'login')}
				>Sign In</button
			>
			<button class="tab {mode === 'register' ? 'active' : ''}" onclick={() => (mode = 'register')}
				>Register</button
			>
		</div>

		<!-- Form -->
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<div class="field">
				<label class="label" for="email">Email</label>
				<input
					class="input"
					id="email"
					type="email"
					bind:value={email}
					placeholder="hello@email.com"
					required
				/>
			</div>
			<div class="field">
				<label class="label" for="password">Password</label>
				<input
					class="input"
					id="password"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					required
				/>
			</div>

			{#if feedback}
				<div class="feedback {feedbackType}">{feedback}</div>
			{/if}

			<button class="btn btn-primary w-full" type="submit" disabled={loading}>
				{#if loading}<span class="spinner"></span>{/if}
				{mode === 'login' ? 'Sign In' : 'Create Account'}
			</button>
		</form>

		<div class="divider"><span>or continue with</span></div>

		<div class="auth-alts">
			<button class="alt-btn" onclick={handleGoogle}>
				<svg width="18" height="18" viewBox="0 0 24 24"
					><path
						fill="#4285F4"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/><path
						fill="#34A853"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/><path
						fill="#FBBC05"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/><path
						fill="#EA4335"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/></svg
				>
				Google
			</button>
			<button class="alt-btn" onclick={handleMagicLink}> ✨ Magic Link </button>
			<button class="alt-btn ghost" onclick={handleGuest}> 👻 Guest </button>
		</div>
	</div>
</div>

<style>
	.auth-root {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: var(--bg);
		position: relative;
		overflow: hidden;
	}

	.auth-card {
		width: 100%;
		max-width: 420px;
		background: var(--surface);
		border-radius: 28px;
		padding: 36px;
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--border);
		position: relative;
		z-index: 1;
	}

	.auth-logo {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 28px;
	}

	.logo-icon {
		width: 52px;
		height: 52px;
		background: linear-gradient(135deg, #7c3aed, #a78bfa);
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
	}

	.auth-logo h1 {
		font-size: 22px;
		color: var(--text);
		margin: 0;
		line-height: 1;
	}

	.auth-logo p {
		font-size: 12px;
		color: var(--text-muted);
		margin: 4px 0 0;
		font-weight: 500;
	}

	.auth-tabs {
		display: flex;
		background: var(--surface2);
		border-radius: 99px;
		padding: 4px;
		margin-bottom: 24px;
		gap: 4px;
	}

	.tab {
		flex: 1;
		padding: 9px;
		border-radius: 99px;
		border: none;
		background: transparent;
		color: var(--text-muted);
		font-family: 'Nunito', sans-serif;
		font-weight: 700;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.tab.active {
		background: var(--surface);
		color: var(--violet);
		box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15);
	}

	.field {
		margin-bottom: 16px;
	}

	.feedback {
		padding: 10px 14px;
		border-radius: var(--radius-sm);
		font-size: 13px;
		font-weight: 600;
		margin-bottom: 14px;
	}

	.feedback.error {
		background: var(--red-light);
		color: var(--red);
	}
	.feedback.success {
		background: var(--green-light);
		color: var(--green);
	}

	.w-full {
		width: 100%;
		margin-top: 4px;
		padding: 13px;
		font-size: 15px;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 20px 0;
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--border);
	}

	.auth-alts {
		display: flex;
		gap: 8px;
	}

	.alt-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 10px 8px;
		border-radius: var(--radius-sm);
		border: 2px solid var(--border);
		background: var(--surface);
		color: var(--text);
		font-family: 'Nunito', sans-serif;
		font-weight: 700;
		font-size: 13px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.alt-btn:hover {
		border-color: var(--violet-soft);
		background: var(--violet-light);
		color: var(--violet);
		transform: translateY(-2px);
	}

	.alt-btn.ghost {
		background: var(--surface2);
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
