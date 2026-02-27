<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const balance = $derived(data.totalIncome - data.totalExpenses);
	const savingsRate = $derived(
		data.totalIncome > 0
			? (((data.totalIncome - data.totalExpenses) / data.totalIncome) * 100).toFixed(0)
			: 0
	);
	function fmt(n: number) {
		return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
	}
	let canvas = $state<HTMLCanvasElement | null>(null);
	let chart: InstanceType<typeof Chart> | null = null;
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
						backgroundColor: 'rgba(16,185,129,0.15)',
						borderColor: '#10B981',
						borderWidth: 2,
						borderRadius: 10
					},
					{
						label: 'Expenses',
						data: data.monthlyData.map((m) => m.expenses),
						backgroundColor: 'rgba(244,63,94,0.15)',
						borderColor: '#F43F5E',
						borderWidth: 2,
						borderRadius: 10
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: 'rgba(45,27,105,0.95)',
						padding: 12,
						cornerRadius: 12,
						callbacks: {
							label: (ctx) => ` ${fmt(ctx.parsed.y ?? 0)}`
						}
					}
				},
				scales: {
					x: {
						grid: { display: false },
						ticks: { color: '#8B7BAE', font: { family: 'Nunito', weight: 'bold' as const } }
					},
					y: {
						grid: { color: 'rgba(139,123,174,0.1)' },
						ticks: {
							color: '#8B7BAE',
							font: { family: 'Nunito', weight: 'bold' as const },
							callback: (val) => '₱' + Number(val).toLocaleString()
						}
					}
				}
			}
		});
		return () => chart?.destroy();
	});
	const categoryEmoji: Record<string, string> = {
		food: '🍔',
		transport: '🚗',
		utilities: '💡',
		rent: '🏠',
		entertainment: '🎬',
		health: '💊',
		general: '📦',
		other: '🎯',
		subscription: '📱',
		insurance: '🛡️',
		loan: '💳',
		salary: '💼',
		freelance: '💻',
		investment: '📈',
		gift: '🎁'
	};
</script>

<div class="dash">
	<!-- Decorative blob -->
	<div class="blob" style="width:380px;height:380px;background:#c4b5fd;top:-80px;right:-80px"></div>
	<!-- Header -->
	<div class="dash-header fade-up">
		<div>
			<h1>Dashboard 👋</h1>
			<p>Here's your cashflow overview</p>
		</div>
		{#if Number(savingsRate) > 0}
			<div class="savings-pill">🎯 {savingsRate}% savings rate</div>
		{/if}
	</div>
	<!-- Balance Hero -->
	<div class="balance-card fade-up-1">
		<div class="balance-inner">
			<p class="balance-label">Total Balance</p>
			<p class="balance-amount">{fmt(balance)}</p>
			<p class="balance-sub">Income minus Expenses ✨</p>
		</div>
		<div class="balance-deco">💰</div>
	</div>
	<!-- Stats -->
	<div class="stats-row fade-up-2">
		<div class="stat-card">
			<div class="stat-icon" style="background:var(--green-light)">💰</div>
			<div>
				<p class="stat-label">Total Income</p>
				<p class="stat-value" style="color:var(--green)">{fmt(data.totalIncome)}</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon" style="background:var(--red-light)">💸</div>
			<div>
				<p class="stat-label">Total Expenses</p>
				<p class="stat-value" style="color:var(--red)">{fmt(data.totalExpenses)}</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon" style="background:var(--violet-light)">📅</div>
			<div>
				<p class="stat-label">Scheduled</p>
				<p class="stat-value" style="color:var(--violet)">{data.scheduledItems.length} items</p>
			</div>
		</div>
	</div>
	<!-- Chart + Upcoming -->
	<div class="bottom-grid fade-up-3">
		<!-- Chart -->
		<div class="card chart-card">
			<div class="card-header">
				<h3>Last 6 Months 📊</h3>
				<div class="legend">
					<span class="ldot green"></span>Income
					<span class="ldot red"></span>Expenses
				</div>
			</div>
			<div class="chart-wrap">
				<canvas bind:this={canvas}></canvas>
			</div>
		</div>
		<!-- Upcoming Scheduled -->
		<div class="card upcoming-card">
			<div class="card-header">
				<h3>Upcoming 📅</h3>
				<a href="/scheduled" class="see-all">See all →</a>
			</div>
			{#if data.scheduledItems.length === 0}
				<div class="empty-state">
					<span>🎉</span>
					<p>No scheduled payments!</p>
				</div>
			{:else}
				<div class="upcoming-list">
					{#each data.scheduledItems as item}
						<div class="upcoming-item">
							<div class="upcoming-icon">
								{categoryEmoji[item.category] ?? '📦'}
							</div>
							<div class="upcoming-info">
								<p class="upcoming-name">{item.label}</p>
								<p class="upcoming-freq">{item.frequency}</p>
							</div>
							<p class="upcoming-amount">{fmt(parseFloat(item.amount))}</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.dash {
		padding: 32px;
		max-width: 1000px;
		position: relative;
	}
	.dash-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
		flex-wrap: wrap;
		gap: 12px;
	}
	.dash-header h1 {
		font-size: 28px;
		margin: 0 0 4px;
	}
	.dash-header p {
		color: var(--text-muted);
		margin: 0;
		font-size: 14px;
		font-weight: 500;
	}
	.savings-pill {
		background: var(--green-light);
		color: var(--green);
		padding: 8px 18px;
		border-radius: 99px;
		font-size: 13px;
		font-weight: 700;
		white-space: nowrap;
	}
	/* Balance */
	.balance-card {
		background: linear-gradient(135deg, #7c3aed 0%, #9f67fa 50%, #c084fc 100%);
		border-radius: 24px;
		padding: 32px;
		margin-bottom: 20px;
		position: relative;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(124, 58, 237, 0.35);
	}
	.balance-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
	}
	.balance-inner {
		position: relative;
		z-index: 1;
	}
	.balance-label {
		color: rgba(255, 255, 255, 0.75);
		font-size: 13px;
		font-weight: 600;
		margin: 0 0 8px;
	}
	.balance-amount {
		color: white;
		font-size: 42px;
		font-weight: 800;
		margin: 0;
		letter-spacing: -1px;
		font-family: 'Quicksand', sans-serif;
	}
	.balance-sub {
		color: rgba(255, 255, 255, 0.6);
		font-size: 12px;
		margin: 8px 0 0;
		font-weight: 500;
	}
	.balance-deco {
		position: absolute;
		right: 28px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 80px;
		opacity: 0.15;
		z-index: 0;
	}
	/* Stats */
	.stats-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
		margin-bottom: 20px;
	}
	.stat-card {
		background: var(--surface);
		border-radius: 20px;
		padding: 18px;
		display: flex;
		align-items: center;
		gap: 14px;
		border: 1px solid var(--border);
		box-shadow: var(--shadow);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}
	.stat-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-lg);
	}
	.stat-icon {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		flex-shrink: 0;
	}
	.stat-label {
		color: var(--text-muted);
		font-size: 11px;
		font-weight: 700;
		margin: 0 0 4px;
		text-transform: uppercase;
		letter-spacing: 0.4px;
	}
	.stat-value {
		font-size: 17px;
		font-weight: 800;
		margin: 0;
	}
	/* Bottom grid */
	.bottom-grid {
		display: grid;
		/* grid-template-columns: 1.6fr 1fr; */
		gap: 20px;
	}
	.card {
		padding: 24px;
	}
	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	.card-header h3 {
		margin: 0;
		font-size: 16px;
		color: var(--text);
	}
	.legend {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--text-muted);
	}
	.ldot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
		margin-right: 3px;
	}
	.ldot.green {
		background: #10b981;
	}
	.ldot.red {
		background: #f43f5e;
	}
	.chart-wrap {
		height: 230px;
	}
	.see-all {
		font-size: 13px;
		font-weight: 700;
		color: var(--violet);
		text-decoration: none;
		transition: opacity 0.2s;
	}
	.see-all:hover {
		opacity: 0.7;
	}
	/* Upcoming */
	.upcoming-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.upcoming-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: var(--surface2);
		border-radius: 14px;
		transition: transform 0.15s;
		cursor: default;
	}
	.upcoming-item:hover {
		transform: translateX(4px);
	}
	.upcoming-icon {
		width: 38px;
		height: 38px;
		background: var(--violet-light);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		flex-shrink: 0;
	}
	.upcoming-info {
		flex: 1;
		min-width: 0;
	}
	.upcoming-name {
		font-size: 13px;
		font-weight: 700;
		margin: 0 0 2px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.upcoming-freq {
		font-size: 11px;
		color: var(--text-muted);
		margin: 0;
		font-weight: 600;
		text-transform: capitalize;
	}
	.upcoming-amount {
		font-size: 13px;
		font-weight: 800;
		color: var(--violet);
		white-space: nowrap;
		flex-shrink: 0;
	}
	.empty-state {
		text-align: center;
		padding: 32px 16px;
	}
	.empty-state span {
		font-size: 40px;
		display: block;
		margin-bottom: 10px;
	}
	.empty-state p {
		color: var(--text-muted);
		font-size: 14px;
		font-weight: 600;
		margin: 0;
	}
	/* Responsive */
	@media (max-width: 768px) {
		.dash {
			padding: 20px 16px 90px;
		}
		.stats-row {
			grid-template-columns: 1fr 1fr;
		}
		.stats-row .stat-card:last-child {
			grid-column: span 2;
		}
		.bottom-grid {
			grid-template-columns: 1fr;
		}
		.balance-amount {
			font-size: 32px;
		}
		.savings-pill {
			font-size: 12px;
			padding: 6px 14px;
		}
		.balance-deco {
			font-size: 60px;
		}
	}
	@media (max-width: 400px) {
		.stats-row {
			grid-template-columns: 1fr;
		}
		.stats-row .stat-card:last-child {
			grid-column: span 1;
		}
	}
</style>
