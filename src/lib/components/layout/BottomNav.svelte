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

<div class="fixed right-0 bottom-0 left-0 z-50 flex border-t border-gray-100 bg-white md:hidden">
	{#each links as link}
		<a
			href={link.href}
			class="flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors
        {$page.url.pathname === link.href ? 'font-semibold text-violet-600' : 'text-gray-400'}"
		>
			<span class="text-xl">{link.icon}</span>
			{link.label}
		</a>
	{/each}
	<button
		onclick={handleLogout}
		class="flex flex-1 cursor-pointer flex-col items-center gap-1 py-2 text-xs text-gray-400 transition-colors hover:text-red-400"
	>
		<span class="text-xl">🚪</span>
		Logout
	</button>
</div>
