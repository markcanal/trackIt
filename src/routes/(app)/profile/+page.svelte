<script lang="ts">
	import { enhance } from '$app/forms';
	import { signOut } from '$lib/auth/auth-client.js';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	const user = $derived(data.session?.user);
	const isAnonymous = $derived(!user?.email);

	let nameSuccess = $state(false);
	let passwordSuccess = $state(false);

	async function handleLogout() {
		await signOut();
		goto('/auth');
	}
</script>

<!-- Header -->
<div class="mb-6">
	<h1 class="text-2xl font-bold text-gray-800">Profile 👤</h1>
	<p class="text-sm text-gray-400">Manage your account settings.</p>
</div>

<!-- Avatar + Info -->
<div class="mb-4 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
	<div
		class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-600"
	>
		{#if user?.image}
			<img src={user.image} alt="avatar" class="h-14 w-14 rounded-full object-cover" />
		{:else}
			{user?.name?.charAt(0).toUpperCase() ?? '?'}
		{/if}
	</div>
	<div class="min-w-0">
		<p class="truncate font-semibold text-gray-800">{user?.name ?? 'Guest'}</p>
		<p class="truncate text-sm text-gray-400">{user?.email ?? 'Anonymous account'}</p>
		{#if isAnonymous}
			<span
				class="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600"
			>
				Guest — data may be lost
			</span>
		{/if}
	</div>
</div>

{#if !isAnonymous}
	<!-- Update Name -->
	<div class="mb-4 rounded-2xl bg-white p-5 shadow-sm">
		<h2 class="mb-3 font-semibold text-gray-700">Display Name</h2>
		<form
			method="POST"
			action="?/updateName"
			use:enhance={() => {
				return ({ update }) => {
					update();
					nameSuccess = true;
					setTimeout(() => (nameSuccess = false), 3000);
				};
			}}
			class="space-y-3"
		>
			{#if form?.error}
				<p class="text-sm text-red-400">{form.error}</p>
			{/if}
			{#if nameSuccess}
				<p class="text-sm text-green-500">✅ Name updated!</p>
			{/if}
			<input
				name="name"
				value={user?.name ?? ''}
				placeholder="Your name"
				required
				class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
			/>
			<button
				type="submit"
				class="w-full cursor-pointer rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
			>
				Update Name
			</button>
		</form>
	</div>

	<!-- Change Password -->
	<div class="mb-4 rounded-2xl bg-white p-5 shadow-sm">
		<h2 class="mb-3 font-semibold text-gray-700">Change Password</h2>
		<form
			method="POST"
			action="?/changePassword"
			use:enhance={() => {
				return ({ update }) => {
					update();
					passwordSuccess = true;
					setTimeout(() => (passwordSuccess = false), 3000);
				};
			}}
			class="space-y-3"
		>
			{#if form?.error}
				<p class="text-sm text-red-400">{form.error}</p>
			{/if}
			{#if passwordSuccess}
				<p class="text-sm text-green-500">✅ Password changed!</p>
			{/if}
			<input
				name="currentPassword"
				type="password"
				placeholder="Current password"
				required
				class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
			/>
			<input
				name="newPassword"
				type="password"
				placeholder="New password (min 8 chars)"
				required
				class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
			/>
			<button
				type="submit"
				class="w-full cursor-pointer rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
			>
				Change Password
			</button>
		</form>
	</div>
{/if}

<!-- Buy Me a Coffee -->
<div class="mb-4 rounded-2xl bg-white p-5 text-center shadow-sm dark:bg-[#1a1a24]">
	<p class="mb-2 text-2xl">☕</p>
	<p class="font-semibold text-gray-700 dark:text-gray-200">Enjoying TrackIt?</p>
	<p class="mt-1 mb-4 text-sm text-gray-400">
		If this app helps you manage your cashflow, consider buying me a coffee!
	</p>
	<a
		href="https://www.buymeacoffee.com/markjeraldp"
		target="_blank"
		rel="noopener noreferrer"
		class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-yellow-400
           px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-yellow-500"
	>
		<span>☕</span> Buy me a coffee
	</a>
</div>

<!-- Danger Zone -->
<div class="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
	<h2 class="mb-3 font-semibold text-red-400">Danger Zone</h2>
	<button
		onclick={handleLogout}
		class="w-full cursor-pointer rounded-xl border border-red-200 py-3 text-sm font-semibold
           text-red-400 transition hover:bg-red-50"
	>
		Sign Out
	</button>
</div>
