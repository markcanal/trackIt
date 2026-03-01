<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let showForm = $state(false);
	let editingId = $state<string | null>(null);
	let showFilters = $state(false);
	const categories = [
		'general',
		'food',
		'transport',
		'utilities',
		'rent',
		'entertainment',
		'health',
		'other'
	];
	const total = $derived(data.items.reduce((s, i) => s + parseFloat(i.amount), 0));
	const topCategory = $derived(() => {
		const grouped = data.items.reduce((acc: Record<string, number>, i) => {
			acc[i.category] = (acc[i.category] ?? 0) + parseFloat(i.amount);
			return acc;
		}, {});
		return Object.entries(grouped).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';
	});
	function fmt(n: number) {
		return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
	}
	const categoryEmoji: Record<string, string> = {
		general: '📦',
		food: '🍔',
		transport: '🚗',
		utilities: '💡',
		rent: '🏠',
		entertainment: '🎉',
		health: '⚕️',
		other: '🎯'
	};
</script>

<div class="page">
	<div
		class="blob"
		style="width:300px;height:300px;background:#fee2e2;top:-60px;right:-60px;opacity:0.2"
	></div>

	<!-- Header -->
	<div class="page-header fade-up">
		<div>
			<h1>Expenses 💸</h1>
			<span class="total-badge expense-badge">Total: {fmt(total)}</span>
		</div>
		<div class="header-actions">
			<a href="/export?type=expenses" class="btn btn-ghost" download>⬇️ CSV</a>
			<button class="btn btn-ghost" onclick={() => (showFilters = !showFilters)}>
				{showFilters ? '✕' : '🔍'}
			</button>
			<button
				class="btn btn-danger-soft"
				onclick={() => {
					showForm = !showForm;
					editingId = null;
				}}
			>
				{showForm ? '✕ Cancel' : '+ Add'}
			</button>
		</div>
	</div>

	<!-- Summary Strip -->
	{#if data.items.length > 0}
		<div class="summary-strip fade-up-1">
			<div class="summary-item">
				<span class="summary-icon">📊</span>
				<div>
					<p class="summary-label">Entries</p>
					<p class="summary-val">{data.items.length}</p>
				</div>
			</div>
			<div class="summary-divider"></div>
			<div class="summary-item">
				<span class="summary-icon">🏆</span>
				<div>
					<p class="summary-label">Top Category</p>
					<p class="summary-val">{categoryEmoji[topCategory()]} {topCategory()}</p>
				</div>
			</div>
			<div class="summary-divider"></div>
			<div class="summary-item">
				<span class="summary-icon">📅</span>
				<div>
					<p class="summary-label">This month</p>
					<p class="summary-val">
						{fmt(
							data.items
								.filter((i) => new Date(i.date).getMonth() === new Date().getMonth())
								.reduce((s, i) => s + parseFloat(i.amount), 0)
						)}
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Filter Panel -->
	{#if showFilters}
		<div class="card filter-card fade-up">
			<form method="GET" class="filter-form">
				<div class="filter-row">
					<div class="field">
						<label for="from" class="label">From</label>
						<input
							id="from"
							class="input"
							type="date"
							name="from"
							value={data.filters?.from ?? ''}
						/>
					</div>
					<div class="field">
						<label for="to" class="label">To</label>
						<input id="to" class="input" type="date" name="to" value={data.filters?.to ?? ''} />
					</div>
					<div class="field">
						<label for="cat-filter" class="label">Category</label>
						<select id="cat-filter" class="input" name="category">
							<option value="">All categories</option>
							{#each categories as cat}
								<option value={cat} selected={data.filters?.category === cat}>
									{categoryEmoji[cat]}
									{cat}
								</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="filter-actions">
					<button class="btn btn-danger-soft" type="submit">Apply</button>
					<a href="/expenses" class="btn btn-ghost">Clear</a>
				</div>
			</form>
		</div>
	{/if}

	<!-- Add Form -->
	{#if showForm}
		<div class="card form-card fade-up">
			<h3>➕ New Expense</h3>
			<form
				method="POST"
				action="?/add"
				use:enhance={() => {
					return ({ result, update }) => {
						if (result.type === 'success') {
							showForm = false;
							update();
						}
					};
				}}
			>
				<div class="form-grid">
					<div class="field">
						<label for="add-label" class="label">Label</label>
						<input id="add-label" class="input" name="label" placeholder="e.g. Grocery" required />
					</div>
					<div class="field">
						<label for="add-amount" class="label">Amount</label>
						<input
							id="add-amount"
							class="input"
							name="amount"
							type="number"
							step="0.01"
							placeholder="0.00"
							required
						/>
					</div>
					<div class="field">
						<label for="add-cat" class="label">Category</label>
						<select id="add-cat" class="input" name="category">
							{#each categories as cat}
								<option value={cat}>{categoryEmoji[cat]} {cat}</option>
							{/each}
						</select>
					</div>
					<div class="field">
						<label for="add-date" class="label">Date</label>
						<input
							id="add-date"
							class="input"
							name="date"
							type="date"
							value={new Date().toISOString().split('T')[0]}
							required
						/>
					</div>
				</div>
				<div class="field">
					<label for="add-note" class="label">Note (optional)</label>
					<input id="add-note" class="input" name="note" placeholder="Add a note..." />
				</div>
				<button class="btn btn-danger-soft full-btn" type="submit">Save Expense 💸</button>
			</form>
		</div>
	{/if}

	<!-- List -->
	<div class="items-list fade-up-2">
		{#if data.items.length === 0}
			<div class="empty-card card">
				<span>💸</span>
				<h3>No expenses yet</h3>
				<p>Track your spending by adding your first expense!</p>
				<button class="btn btn-danger-soft" onclick={() => (showForm = true)}>+ Add Expense</button>
			</div>
		{:else}
			{#each data.items as item, i}
				<div class="item-card card" style="animation-delay: {i * 0.04}s">
					{#if editingId === item.id}
						<form
							method="POST"
							action="?/edit"
							use:enhance={() => {
								return ({ result, update }) => {
									if (result.type === 'success') {
										editingId = null;
										update();
									}
								};
							}}
						>
							<input type="hidden" name="id" value={item.id} />
							<h4 class="edit-title">✏️ Edit Expense</h4>
							<div class="form-grid">
								<div class="field">
									<label for="e-label" class="label">Label</label>
									<input id="e-label" class="input" name="label" value={item.label} required />
								</div>
								<div class="field">
									<label for="e-amount" class="label">Amount</label>
									<input
										id="e-amount"
										class="input"
										name="amount"
										type="number"
										step="0.01"
										value={item.amount}
										required
									/>
								</div>
								<div class="field">
									<label for="e-cat" class="label">Category</label>
									<select id="e-cat" class="input" name="category">
										{#each categories as cat}
											<option value={cat} selected={item.category === cat}
												>{categoryEmoji[cat]} {cat}</option
											>
										{/each}
									</select>
								</div>
								<div class="field">
									<label for="e-date" class="label">Date</label>
									<input
										id="e-date"
										class="input"
										name="date"
										type="date"
										value={item.date.toISOString().split('T')[0]}
										required
									/>
								</div>
							</div>
							<div class="field">
								<label for="e-note" class="label">Note</label>
								<input id="e-note" class="input" name="note" value={item.note ?? ''} />
							</div>
							<div class="edit-actions">
								<button class="btn btn-danger-soft" type="submit">Save</button>
								<button class="btn btn-ghost" type="button" onclick={() => (editingId = null)}
									>Cancel</button
								>
							</div>
						</form>
					{:else}
						<div class="item-view">
							<div class="item-icon">{categoryEmoji[item.category] ?? '📦'}</div>
							<div class="item-info">
								<p class="item-label">{item.label}</p>
								<div class="item-meta">
									<span class="badge expense-cat"
										>{categoryEmoji[item.category]} {item.category}</span
									>
									{#if item.note}<span class="item-note">· {item.note}</span>{/if}
								</div>
								<p class="item-date">
									{new Date(item.date).toLocaleDateString('en-PH', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</p>
							</div>
							<div class="item-right">
								<p class="item-amount expense-amount">{fmt(parseFloat(item.amount))}</p>
								<div class="item-actions">
									<button class="icon-btn" onclick={() => (editingId = item.id)} title="Edit"
										>✏️</button
									>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={item.id} />
										<button class="icon-btn danger" type="submit" title="Delete">🗑️</button>
									</form>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.page {
		padding: 32px;
		max-width: 100%;
		position: relative;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 16px;
		gap: 12px;
	}
	.page-header h1 {
		font-size: 26px;
		margin: 0 0 6px;
	}

	.total-badge {
		display: inline-flex;
		padding: 4px 12px;
		border-radius: 99px;
		font-size: 12px;
		font-weight: 700;
	}
	.expense-badge {
		background: var(--red-light);
		color: var(--red);
	}

	.header-actions {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
		align-items: center;
	}

	/* Summary strip */
	.summary-strip {
		display: flex;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 16px 20px;
		margin-bottom: 16px;
		box-shadow: var(--shadow);
		gap: 0;
	}
	.summary-item {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.summary-icon {
		font-size: 22px;
	}
	.summary-label {
		font-size: 10px;
		font-weight: 700;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.4px;
		margin: 0 0 2px;
	}
	.summary-val {
		font-size: 13px;
		font-weight: 800;
		color: var(--text);
		margin: 0;
	}
	.summary-divider {
		width: 1px;
		height: 36px;
		background: var(--border);
		margin: 0 12px;
		flex-shrink: 0;
	}

	/* Buttons */
	.btn-danger-soft {
		background: var(--red-light);
		color: var(--red);
		border: none;
		padding: 10px 18px;
		border-radius: 99px;
		font-family: 'Nunito', sans-serif;
		font-weight: 700;
		font-size: 13px;
		cursor: pointer;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.btn-danger-soft:hover {
		background: var(--red);
		color: white;
		transform: translateY(-1px);
	}
	.full-btn {
		width: 100%;
		justify-content: center;
		margin-top: 8px;
		padding: 13px;
		font-size: 14px;
	}

	/* Filter */
	.filter-card {
		padding: 20px;
		margin-bottom: 14px;
	}
	.filter-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.filter-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 10px;
	}
	.filter-actions {
		display: flex;
		gap: 8px;
	}

	/* Form */
	.form-card {
		padding: 22px;
		margin-bottom: 14px;
	}
	.form-card h3 {
		margin: 0 0 18px;
		font-size: 17px;
	}
	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-bottom: 10px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	/* List */
	.items-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.item-card {
		padding: 16px 18px;
		animation: fadeUp 0.3s ease both;
		transition: transform 0.15s;
	}
	.item-card:hover {
		transform: translateY(-1px);
	}

	.item-view {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.item-icon {
		width: 42px;
		height: 42px;
		background: var(--red-light);
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 19px;
		flex-shrink: 0;
	}

	.item-info {
		flex: 1;
		min-width: 0;
	}
	.item-label {
		font-size: 14px;
		font-weight: 700;
		margin: 0 0 4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.item-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 3px;
		flex-wrap: wrap;
	}

	.expense-cat {
		background: var(--red-light);
		color: var(--red);
		padding: 2px 8px;
		border-radius: 99px;
		font-size: 11px;
		font-weight: 700;
	}

	.item-note {
		font-size: 11px;
		color: var(--text-muted);
	}
	.item-date {
		font-size: 11px;
		color: var(--text-muted);
		font-weight: 600;
		margin: 0;
	}

	.item-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6px;
		flex-shrink: 0;
	}
	.item-amount {
		font-size: 16px;
		font-weight: 800;
		margin: 0;
	}
	.expense-amount {
		color: var(--red);
	}

	.item-actions {
		display: flex;
		gap: 4px;
	}
	.icon-btn {
		width: 30px;
		height: 30px;
		border-radius: 10px;
		border: none;
		background: var(--surface2);
		cursor: pointer;
		font-size: 13px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	.icon-btn:hover {
		background: var(--red-light);
		transform: scale(1.1);
	}
	.icon-btn.danger:hover {
		background: var(--red-light);
	}

	.edit-title {
		margin: 0 0 14px;
		font-size: 15px;
		color: var(--red);
	}
	.edit-actions {
		display: flex;
		gap: 8px;
		margin-top: 10px;
	}

	.empty-card {
		padding: 48px 24px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.empty-card span {
		font-size: 52px;
	}
	.empty-card h3 {
		margin: 0;
		font-size: 20px;
	}
	.empty-card p {
		color: var(--text-muted);
		margin: 0 0 16px;
		font-size: 14px;
	}

	@media (max-width: 640px) {
		.page {
			padding: 20px 16px 90px;
		}
		.form-grid {
			grid-template-columns: 1fr;
		}
		.filter-row {
			grid-template-columns: 1fr;
		}
		.item-note {
			display: none;
		}
	}
</style>
