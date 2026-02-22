<script lang="ts">
	import { Chart } from 'chart.js/auto';
	import type { PageData } from './$types.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	const balance = $derived(data.totalIncome - data.totalExpenses);

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-PH', {
			style: 'currency',
			currency: 'PHP'
		}).format(amount);
	}

	let canvas = $state<HTMLCanvasElement | null>(null);
	let chart: Chart | null = null;

	onMount(() => {
		if (!canvas) return;
		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: data.monthlyData.map((m) => m.label),
				datasets: [
					{
						label: 'Income',
						data: data.monthlyData.map((m) => m.income),
						backgroundColor: '#22c55e',
						borderRadius: 6
					},
					{
						label: 'Expenses',
						data: data.monthlyData.map((m) => m.expenses),
						backgroundColor: '#f87171',
						borderRadius: 6
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'bottom' },
					tooltip: {
						callbacks: {
							label: (ctx) => formatCurrency(ctx.parsed.y ?? 0)
						}
					}
				},
				scales: {
					y: {
						ticks: {
							callback: (val) => '₱' + Number(val).toLocaleString()
						}
					}
				}
			}
		});

		return () => chart?.destroy();
	});
</script>

<!-- Header -->
<div class="mb-6">
	<h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
	<p class="text-sm text-gray-400">Here's your cashflow overview.</p>
</div>

<!-- Balance Card -->
<div class="mb-4 rounded-2xl bg-violet-600 p-5 text-white shadow-md">
	<p class="text-sm opacity-75">Total Balance</p>
	<p class="mt-1 text-4xl font-bold">{formatCurrency(balance)}</p>
	<p class="mt-2 text-xs opacity-60">Income minus Expenses</p>
</div>

<!-- Income & Expense Cards -->
<div class="mb-6 grid grid-cols-2 gap-3">
	<div class="rounded-2xl bg-white p-4 shadow-sm">
		<div class="mb-2 flex items-center gap-2">
			<span class="text-lg">💰</span>
			<p class="text-xs font-medium text-gray-400">Income</p>
		</div>
		<p class="text-xl font-bold text-green-500">{formatCurrency(data.totalIncome)}</p>
	</div>

	<div class="rounded-2xl bg-white p-4 shadow-sm">
		<div class="mb-2 flex items-center gap-2">
			<span class="text-lg">💸</span>
			<p class="text-xs font-medium text-gray-400">Expenses</p>
		</div>
		<p class="text-xl font-bold text-red-400">{formatCurrency(data.totalExpenses)}</p>
	</div>
</div>

<!-- Monthly Chart -->
<div class="mb-4 rounded-2xl bg-white p-4 shadow-sm">
	<h2 class="mb-3 font-semibold text-gray-700">Last 6 Months</h2>
	<canvas bind:this={canvas}></canvas>
</div>

<!-- Scheduled Section -->
<div class="rounded-2xl bg-white p-4 shadow-sm">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="font-semibold text-gray-700">Upcoming Scheduled</h2>
		<a href="/scheduled" class="text-xs text-violet-500 hover:underline">See all</a>
	</div>

	{#if data.scheduledItems.length === 0}
		<div class="py-6 text-center">
			<p class="mb-2 text-3xl">📅</p>
			<p class="text-sm text-gray-400">No scheduled expenses yet.</p>
			<a href="/scheduled" class="mt-1 inline-block text-xs text-violet-500 hover:underline">
				Add one →
			</a>
		</div>
	{:else}
		<div class="space-y-3">
			{#each data.scheduledItems as item}
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-700">{item.label}</p>
						<p class="text-xs text-gray-400 capitalize">{item.frequency}</p>
					</div>
					<p class="text-sm font-semibold text-gray-800">{formatCurrency(Number(item.amount))}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
