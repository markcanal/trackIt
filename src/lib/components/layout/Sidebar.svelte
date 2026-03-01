<script lang="ts">
	import { page } from '$app/stores';
	import { darkMode, toggleTheme } from '$lib/stores/theme';

	let { collapsed = $bindable(false) } = $props();

	const links = [
		{ href: '/dashboard', label: 'Dashboard', icon: '🏠' },
		{ href: '/income', label: 'Income', icon: '💰' },
		{ href: '/expenses', label: 'Expenses', icon: '💸' },
		{ href: '/scheduled', label: 'Scheduled', icon: '📅' },
		{ href: '/profile', label: 'Profile', icon: '👤' }
	];
</script>

<aside class="sidebar" class:collapsed>
	<!-- Toggle button -->
	<button class="toggle-btn" onclick={() => (collapsed = !collapsed)} title="Toggle sidebar">
		<span class="toggle-icon">{collapsed ? '→' : '←'}</span>
	</button>

	<!-- Logo -->
	<div class="sidebar-logo">
		<div class="logo-blob">💸</div>
		{#if !collapsed}<span class="logo-text">TrackIt</span>{/if}
	</div>

	<!-- Nav -->
	<nav class="sidebar-nav">
		{#each links as link}
			<a
				href={link.href}
				class="nav-item {$page.url.pathname.startsWith(link.href) ? 'active' : ''}"
				title={collapsed ? link.label : ''}
			>
				<span class="nav-icon">{link.icon}</span>
				{#if !collapsed}
					<span class="nav-label">{link.label}</span>
					{#if $page.url.pathname.startsWith(link.href)}
						<span class="nav-dot"></span>
					{/if}
				{/if}
			</a>
		{/each}
	</nav>

	<!-- Bottom -->
	<div class="sidebar-bottom">
		<button class="theme-btn" onclick={toggleTheme} title={collapsed ? 'Toggle theme' : ''}>
			<span>{$darkMode ? '☀️' : '🌙'}</span>
			{#if !collapsed}
				<span>{$darkMode ? 'Light mode' : 'Dark mode'}</span>
			{/if}
		</button>
	</div>
</aside>

<style>
	.sidebar {
		width: 220px;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background: var(--surface);
		border-right: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		padding: 16px 12px;
		gap: 6px;
		z-index: 40;
		transition: width 0.3s ease;
		overflow: hidden;
	}

	.sidebar.collapsed {
		width: 68px;
	}

	/* Toggle button */
	.toggle-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		border: 1.5px solid var(--border);
		background: var(--surface);
		color: var(--text-muted);
		cursor: pointer;
		font-size: 12px;
		font-weight: 700;
		transition: all 0.2s;
		align-self: flex-end;
		flex-shrink: 0;
		margin-bottom: 4px;
	}

	.toggle-btn:hover {
		background: var(--violet-light);
		color: var(--violet);
		border-color: var(--violet-soft);
	}

	.toggle-icon {
		line-height: 1;
	}

	/* Logo */
	.sidebar-logo {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 4px 6px 16px;
		font-family: 'Quicksand', sans-serif;
		font-weight: 700;
		font-size: 20px;
		color: var(--text);
		white-space: nowrap;
		overflow: hidden;
	}

	.logo-blob {
		width: 36px;
		height: 36px;
		min-width: 36px;
		background: linear-gradient(135deg, #7c3aed, #a78bfa);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
		flex-shrink: 0;
	}

	.logo-text {
		opacity: 1;
		transition: opacity 0.2s;
		white-space: nowrap;
	}

	/* Nav */
	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 3px;
		flex: 1;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 11px 10px;
		border-radius: 14px;
		text-decoration: none;
		color: var(--text-muted);
		font-weight: 600;
		font-size: 14px;
		transition: all 0.2s;
		position: relative;
		white-space: nowrap;
		overflow: hidden;
	}

	.nav-item:hover {
		background: var(--surface2);
		color: var(--text);
	}

	.nav-item.active {
		background: var(--violet-light);
		color: var(--violet);
	}

	/* Center icon when collapsed */
	.sidebar.collapsed .nav-item {
		justify-content: center;
		padding: 11px 0;
	}

	.nav-icon {
		font-size: 20px;
		flex-shrink: 0;
	}
	.nav-label {
		flex: 1;
	}

	.nav-dot {
		width: 6px;
		height: 6px;
		background: var(--violet);
		border-radius: 50%;
		margin-left: auto;
		flex-shrink: 0;
	}

	/* Bottom */
	.sidebar-bottom {
		padding-top: 8px;
		border-top: 1px solid var(--border);
	}

	.theme-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 10px;
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
		white-space: nowrap;
		overflow: hidden;
	}

	.theme-btn:hover {
		background: var(--surface2);
		color: var(--text);
	}

	.sidebar.collapsed .theme-btn {
		justify-content: center;
	}

	/* Tooltip for collapsed state */
	.sidebar.collapsed .nav-item::after {
		content: attr(title);
		position: absolute;
		left: calc(100% + 12px);
		top: 50%;
		transform: translateY(-50%);
		background: var(--text);
		color: var(--surface);
		padding: 5px 10px;
		border-radius: 8px;
		font-size: 12px;
		font-weight: 700;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.15s;
		z-index: 100;
	}

	.sidebar.collapsed .nav-item:hover::after {
		opacity: 1;
	}

	/* Hide on mobile — bottom nav takes over */
	@media (max-width: 767px) {
		.sidebar {
			display: none;
		}
	}
</style>
