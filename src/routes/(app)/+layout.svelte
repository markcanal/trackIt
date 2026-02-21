<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import type { LayoutData } from './$types.js';

	let { data, children } = $props();
</script>

<AppShell>
	{@render children()}
</AppShell>
