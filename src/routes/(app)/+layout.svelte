<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { initTheme } from '$lib/stores/theme.js';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types.js';

	let { data, children } = $props();

	onMount(() => initTheme());
</script>

<AppShell>
	{@render children()}
</AppShell>
