<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '$lib/auth/auth-client.js';
	import { goto } from '$app/navigation';

	const links = [
		{ href: '/dashboard', label: 'Home', icon: '🏠' },
		{ href: '/income', label: 'Income', icon: '💰' },
		{ href: '/expenses', label: 'Expenses', icon: '💸' },
		{ href: '/scheduled', label: 'Scheduled', icon: '📅' }
	];

	async function handleLogout() {
		await signOut();
		goto('/auth');
	}
</script>

<aside class="hidden min-h-screen w-56 flex-col border-r border-gray-100 bg-white p-4 md:flex">
	<!-- Logo -->
	<div class="mb-8 px-2">
		<h1 class="text-xl font-bold text-violet-600">TrackIt 💸</h1>
		<p class="text-xs text-gray-400">Your cashflow, simplified.</p>
	</div>

	<!-- Nav Links -->
	<nav class="flex flex-1 flex-col gap-1">
		{#each links as link}
			<a
				href={link.href}
				class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors
          {$page.url.pathname === link.href
					? 'bg-violet-50 font-semibold text-violet-600'
					: 'text-gray-500 hover:bg-gray-50'}"
			>
				<span class="text-lg">{link.icon}</span>
				{link.label}
			</a>
		{/each}
	</nav>

	<!-- Logout -->
	<button
		onclick={handleLogout}
		class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm
           text-gray-400 transition-colors hover:bg-red-50 hover:text-red-400"
	>
		<span class="text-lg">🚪</span>
		Logout
	</button>
</aside>
