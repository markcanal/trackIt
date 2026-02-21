<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types.js';

	let { data, children } = $props();
</script>

{@render children()}
