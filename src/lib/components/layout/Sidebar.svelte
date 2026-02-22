<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '$lib/auth/auth-client.js';
	import { goto } from '$app/navigation';
	import { toggleTheme, isDarkMode } from '$lib/stores/theme.js';
	import { onMount } from 'svelte';

	const links = [
		{ href: '/dashboard', label: 'Home', icon: '🏠' },
		{ href: '/income', label: 'Income', icon: '💰' },
		{ href: '/expenses', label: 'Expenses', icon: '💸' },
		{ href: '/scheduled', label: 'Scheduled', icon: '📅' },
		{ href: '/profile', label: 'Profile', icon: '👤' }
	];

	async function handleLogout() {
		await signOut();
		goto('/auth');
	}

	let dark = $state(false);
	onMount(() => {
		dark = isDarkMode();
	});

	function handleToggle() {
		dark = toggleTheme();
	}
</script>

<aside
	class="hidden min-h-screen w-56 flex-col border-r border-gray-100 bg-white p-4 transition-colors md:flex dark:border-[#2a2a38] dark:bg-[#1a1a24]"
>
	<div class="mb-8 px-2">
		<h1 class="text-xl font-bold text-violet-600">TrackIt 💸</h1>
		<p class="text-xs text-gray-400">Your cashflow, simplified.</p>
	</div>

	<nav class="flex flex-1 flex-col gap-1">
		{#each links as link}
			<a
				href={link.href}
				class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors
          {$page.url.pathname === link.href
					? 'bg-violet-50 font-semibold text-violet-600 dark:bg-violet-900/30'
					: 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'}"
			>
				<span class="text-lg">{link.icon}</span>
				{link.label}
			</a>
		{/each}
	</nav>

	<!-- Theme Toggle -->
	<button
		onclick={handleToggle}
		class="mb-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5
           text-sm text-gray-400 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
	>
		<span class="text-lg">{dark ? '☀️' : '🌙'}</span>
		{dark ? 'Light Mode' : 'Dark Mode'}
	</button>
</aside>
