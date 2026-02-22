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

<div
	class="fixed right-0 bottom-0 left-0 z-50 flex border-t border-gray-100 bg-white transition-colors md:hidden dark:border-[#2a2a38] dark:bg-[#1a1a24]"
>
	{#each links as link}
		<a
			href={link.href}
			class="flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors
        {$page.url.pathname === link.href
				? 'font-semibold text-violet-600'
				: 'text-gray-400 dark:text-gray-500'}"
		>
			<span class="text-xl">{link.icon}</span>
			{link.label}
		</a>
	{/each}
	<button
		onclick={handleToggle}
		class="flex flex-1 cursor-pointer flex-col items-center gap-1 py-2 text-xs text-gray-400 dark:text-gray-500"
	>
		<span class="text-xl">{dark ? '☀️' : '🌙'}</span>
		{dark ? 'Light' : 'Dark'}
	</button>
</div>
