<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let showPasswordForm = $state(false);
</script>

<div class="page">
	<div
		class="blob"
		style="width:300px;height:300px;background:#fde68a;top:-40px;right:-40px;opacity:0.2"
	></div>

	<div class="page-header fade-up">
		<h1>Profile 👤</h1>
		<p>Manage your account settings</p>
	</div>

	<!-- Avatar card -->
	<div class="card avatar-card fade-up-1">
		<div class="avatar">
			{#if data.session?.user?.image}
				<img src={data.session.user.image} alt="avatar" />
			{:else}
				<span>{(data.session.user?.name ?? 'U')[0].toUpperCase()}</span>
			{/if}
		</div>
		<div class="avatar-info">
			<h2>{data.session.user?.name ?? 'User'}</h2>
			<p>{data.session.user?.email}</p>
			{#if data.session.user?.isAnonymous}
				<span class="badge" style="background:var(--yellow-light);color:var(--yellow)"
					>👻 Guest</span
				>
			{:else}
				<span class="badge" style="background:var(--green-light);color:var(--green)"
					>✓ Verified</span
				>
			{/if}
		</div>
	</div>

	<!-- Update name -->
	{#if !data.session.user?.isAnonymous}
		<div class="card section-card fade-up-2">
			<h3>✏️ Update Name</h3>
			{#if form?.success}
				<div class="success-msg">✅ Name updated successfully!</div>
			{/if}
			<form method="POST" action="?/updateName" use:enhance>
				<div class="field">
					<label for="" class="label">Display Name</label>
					<input class="input" name="name" value={data.session.user?.name ?? ''} required />
				</div>
				<button class="btn btn-primary" type="submit" style="margin-top:8px">Save Name</button>
			</form>
		</div>

		<!-- Change password -->
		<div class="card section-card fade-up-3">
			<div class="section-header">
				<h3>🔑 Change Password</h3>
				<button class="btn btn-ghost" onclick={() => (showPasswordForm = !showPasswordForm)}>
					{showPasswordForm ? 'Cancel' : 'Change'}
				</button>
			</div>
			{#if showPasswordForm}
				{#if form?.error}
					<div class="error-msg">❌ {form.error}</div>
				{/if}
				{#if form?.success}
					<div class="success-msg">✅ Password changed!</div>
				{/if}
				<form method="POST" action="?/changePassword" use:enhance>
					<div class="field">
						<label for="" class="label">Current Password</label>
						<input class="input" name="currentPassword" type="password" required />
					</div>
					<div class="field" style="margin-top:10px">
						<label for="" class="label">New Password</label>
						<input class="input" name="newPassword" type="password" minlength="8" required />
					</div>
					<button class="btn btn-primary" type="submit" style="margin-top:12px"
						>Update Password</button
					>
				</form>
			{/if}
		</div>
	{/if}

	<!-- Buy me a coffee -->
	<div class="card coffee-card fade-up-4">
		<div class="coffee-content">
			<span class="coffee-emoji">☕</span>
			<div>
				<h3>Enjoying TrackIt?</h3>
				<p>If this app helps you manage your cashflow, consider buying me a coffee!</p>
			</div>
		</div>
		<a
			href="https://www.buymeacoffee.com/markjeraldp"
			target="_blank"
			rel="noopener noreferrer"
			class="btn coffee-btn"
		>
			☕ Buy me a coffee
		</a>
	</div>

	<!-- Danger zone -->
	<div class="card danger-card fade-up-4">
		<h3>⚠️ Danger Zone</h3>
		<p>Once you sign out, you'll need to sign in again to access your data.</p>
		<form method="POST" action="?/signOut" use:enhance>
			<button class="btn btn-danger" type="submit">Sign Out</button>
		</form>
	</div>
</div>

<style>
	.page {
		padding: 32px;
		max-width: 100%;
		position: relative;
	}

	.page-header {
		margin-bottom: 24px;
	}
	.page-header h1 {
		font-size: 28px;
		margin: 0 0 4px;
	}
	.page-header p {
		color: var(--text-muted);
		margin: 0;
		font-size: 14px;
	}

	.avatar-card {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 24px;
		margin-bottom: 16px;
	}

	.avatar {
		width: 72px;
		height: 72px;
		background: linear-gradient(135deg, #7c3aed, #a78bfa);
		border-radius: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		font-weight: 800;
		color: white;
		flex-shrink: 0;
		overflow: hidden;
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-info h2 {
		margin: 0 0 4px;
		font-size: 20px;
	}
	.avatar-info p {
		color: var(--text-muted);
		margin: 0 0 8px;
		font-size: 13px;
	}

	.section-card {
		padding: 24px;
		margin-bottom: 16px;
	}
	.section-card h3 {
		margin: 0 0 16px;
		font-size: 17px;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.section-header h3 {
		margin: 0;
		font-size: 17px;
	}

	.field {
		display: flex;
		flex-direction: column;
	}

	.success-msg {
		background: var(--green-light);
		color: var(--green);
		padding: 10px 14px;
		border-radius: var(--radius-sm);
		font-size: 13px;
		font-weight: 600;
		margin-bottom: 14px;
	}

	.error-msg {
		background: var(--red-light);
		color: var(--red);
		padding: 10px 14px;
		border-radius: var(--radius-sm);
		font-size: 13px;
		font-weight: 600;
		margin-bottom: 14px;
	}

	.coffee-card {
		padding: 24px;
		margin-bottom: 16px;
	}

	.coffee-content {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 16px;
	}

	.coffee-emoji {
		font-size: 40px;
	}
	.coffee-content h3 {
		margin: 0 0 4px;
		font-size: 17px;
	}
	.coffee-content p {
		color: var(--text-muted);
		margin: 0;
		font-size: 13px;
	}

	.coffee-btn {
		background: #fbbf24;
		color: #1a1a1a;
		box-shadow: 0 4px 14px rgba(251, 191, 36, 0.4);
	}

	.coffee-btn:hover {
		background: #f59e0b;
		box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5);
		transform: translateY(-1px);
	}

	.danger-card {
		padding: 24px;
		border: 1px solid var(--red-light);
	}
	.danger-card h3 {
		margin: 0 0 8px;
		font-size: 17px;
		color: var(--red);
	}
	.danger-card p {
		color: var(--text-muted);
		font-size: 13px;
		margin: 0 0 16px;
	}

	.btn-danger {
		background: var(--red-light);
		color: var(--red);
		border: 2px solid var(--red);
	}

	.btn-danger:hover {
		background: var(--red);
		color: white;
	}
</style>
