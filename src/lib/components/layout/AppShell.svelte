<script lang="ts">
	import BottomNav from './BottomNav.svelte';
	import Sidebar from './Sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen bg-gray-50">
	<!-- Desktop Sidebar -->
	<Sidebar />

	<!-- Main Content -->
	<main class="mx-auto w-full max-w-2xl flex-1 p-4 pb-24 md:mx-0 md:p-6 md:pb-6">
		{@render children()}
	</main>

	<!-- Mobile Bottom Nav -->
	<BottomNav />
</div>
