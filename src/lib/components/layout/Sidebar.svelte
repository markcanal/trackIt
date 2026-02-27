<script lang="ts">
	import { page } from '$app/stores';
	import { darkMode, toggleTheme } from '$lib/stores/theme';
	const links = [
		{ href: '/dashboard', label: 'Dashboard', icon: '🏠' },
		{ href: '/income', label: 'Income', icon: '💰' },
		{ href: '/expenses', label: 'Expenses', icon: '💸' },
		{ href: '/scheduled', label: 'Scheduled', icon: '📅' },
		{ href: '/profile', label: 'Profile', icon: '👤' }
	];
</script>

<aside class="sidebar">
	<!-- Logo -->
	<div class="sidebar-logo">
		<div class="logo-blob">💸</div>
		<span>TrackIt</span>
	</div>
	<!-- Nav -->
	<nav class="sidebar-nav">
		{#each links as link}
			<a
				href={link.href}
				class="nav-item {$page.url.pathname.startsWith(link.href) ? 'active' : ''}"
			>
				<span class="nav-icon">{link.icon}</span>
				<span class="nav-label">{link.label}</span>
				{#if $page.url.pathname.startsWith(link.href)}
					<span class="nav-dot"></span>
				{/if}
			</a>
		{/each}
	</nav>
	<!-- Bottom -->
	<div class="sidebar-bottom">
		<button class="theme-btn" onclick={toggleTheme}>
			{$darkMode ? '☀️' : '🌙'}
			<span>{$darkMode ? 'Light mode' : 'Dark mode'}</span>
		</button>
	</div>
</aside>

<style>
	.sidebar {
		width: 220px;
		height: 100vh;
		position: sticky;
		top: 0;
		background: var(--surface);
		border-right: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		padding: 24px 16px;
		gap: 8px;
	}
	.sidebar-logo {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 4px 8px 20px;
		font-family: 'Quicksand', sans-serif;
		font-weight: 700;
		font-size: 20px;
		color: var(--text);
	}
	.logo-blob {
		width: 36px;
		height: 36px;
		background: linear-gradient(135deg, #7c3aed, #a78bfa);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
	}
	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}
	.nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 11px 14px;
		border-radius: 14px;
		text-decoration: none;
		color: var(--text-muted);
		font-weight: 600;
		font-size: 14px;
		transition: all 0.2s;
		position: relative;
	}
	.nav-item:hover {
		background: var(--surface2);
		color: var(--text);
	}
	.nav-item.active {
		background: var(--violet-light);
		color: var(--violet);
	}
	.nav-icon {
		font-size: 18px;
	}
	.nav-dot {
		width: 6px;
		height: 6px;
		background: var(--violet);
		border-radius: 50%;
		margin-left: auto;
	}
	.sidebar-bottom {
		padding-top: 8px;
		border-top: 1px solid var(--border);
	}
	.theme-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-radius: 14px;
		border: none;
		background: transparent;
		color: var(--text-muted);
		font-family: 'Nunito', sans-serif;
		font-weight: 600;
		font-size: 13px;
		cursor: pointer;
		width: 100%;
		transition: all 0.2s;
	}
	.theme-btn:hover {
		background: var(--surface2);
		color: var(--text);
	}

	/* Mobile-first adjustments */
	@media (max-width: 767px) {
		.sidebar {
			display: none;
		}
	}
</style>
