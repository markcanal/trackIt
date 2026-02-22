<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		const timer = setTimeout(() => {
			goto('/dashboard');
		}, 2000);
		return () => clearTimeout(timer);
	});
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-violet-600">
	<div class="animate-pulse text-center">
		<h1 class="text-5xl font-bold tracking-tight text-white">TrackIt</h1>
		<p class="mt-2 text-lg text-violet-200">Your cashflow, simplified.</p>
	</div>

	<div class="mt-8 flex gap-1">
		<span class="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0ms]"></span>
		<span class="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:150ms]"></span>
		<span class="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:300ms]"></span>
	</div>
</div>
