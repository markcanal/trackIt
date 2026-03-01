<script lang="ts">
	import BottomNav from './BottomNav.svelte';
	import Sidebar from './Sidebar.svelte';
	let { children } = $props();
	let collapsed = $state(false);
</script>

<div class="shell">
	<Sidebar bind:collapsed />
	<main class="main-content" class:expanded={collapsed}>
		{@render children()}
	</main>
	<BottomNav />
</div>

<style>
	.shell {
		display: flex;
		min-height: 100vh;
		background: var(--bg);
	}

	.main-content {
		flex: 1;
		min-width: 0;
		margin-left: 220px;
		padding: 0 0 80px;
		transition: margin-left 0.3s ease;
	}

	.main-content.expanded {
		margin-left: 68px;
	}

	/* Mobile — sidebar hidden, bottom nav takes over */
	@media (max-width: 767px) {
		.main-content {
			margin-left: 0 !important;
			padding-bottom: 80px;
		}
	}
</style>
