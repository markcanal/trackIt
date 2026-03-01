<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let showForm = $state(false);
	let editingId = $state<string | null>(null);
	let showFilters = $state(false);
	const categories = ['general', 'rent', 'utilities', 'subscription', 'insurance', 'loan', 'other'];
	const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
	const totalActive = $derived(
		data.items.filter((i) => i.isActive).reduce((s, i) => s + parseFloat(i.amount), 0)
	);
	const activeCount = $derived(data.items.filter((i) => i.isActive).length);
	const pausedCount = $derived(data.items.filter((i) => !i.isActive).length);
	function fmt(n: number) {
		return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
	}
	const categoryEmoji: Record<string, string> = {
		general: '📦',
		rent: '🏠',
		utilities: '💡',
		subscription: '📺',
		insurance: '🛡️',
		loan: '💳',
		other: '🎯'
	};
	const freqColor: Record<string, string> = {
		daily: '#F59E0B',
		weekly: '#3B82F6',
		monthly: '#7C3AED',
		yearly: '#10B981'
	};
	function daysUntil(date: Date) {
		const diff = new Date(date).getTime() - new Date().getTime();
		const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
		if (days < 0) return '⚠️ Overdue';
		if (days === 0) return '🔴 Due today';
		if (days <= 3) return `🟡 ${days}d`;
		return `🟢 ${days}d`;
	}
</script>

<div class="page">
	<div
		class="blob"
		style="width:300px;height:300px;background:#e0e7ff;top:-60px;right:-60px;opacity:0.2"
	></div>

	<!-- Header -->
	<div class="page-header fade-up">
		<div>
			<h1>Scheduled 📅</h1>
			<span class="total-badge scheduled-badge">Active: {fmt(totalActive)}/mo</span>
		</div>
		<div class="header-actions">
			<a href="/export?type=scheduled" class="btn btn-ghost" download>⬇️ CSV</a>
			<button class="btn btn-ghost" onclick={() => (showFilters = !showFilters)}>
				{showFilters ? '✕' : '🔍'}
			</button>
			<button
				class="btn btn-violet"
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
				<span class="summary-icon">✅</span>
				<div>
					<p class="summary-label">Active</p>
					<p class="summary-val">{activeCount}</p>
				</div>
			</div>
			<div class="summary-divider"></div>
			<div class="summary-item">
				<span class="summary-icon">⏸️</span>
				<div>
					<p class="summary-label">Paused</p>
					<p class="summary-val">{pausedCount}</p>
				</div>
			</div>
			<div class="summary-divider"></div>
			<div class="summary-item">
				<span class="summary-icon">💸</span>
				<div>
					<p class="summary-label">Monthly cost</p>
					<p class="summary-val">{fmt(totalActive)}</p>
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
					<div class="field">
						<label for="freq-filter" class="label">Frequency</label>
						<select id="freq-filter" class="input" name="frequency">
							<option value="">All frequencies</option>
							{#each frequencies as freq}
								<option value={freq} selected={data.filters?.frequency === freq}>{freq}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="filter-actions">
					<button class="btn btn-violet" type="submit">Apply</button>
					<a href="/scheduled" class="btn btn-ghost">Clear</a>
				</div>
			</form>
		</div>
	{/if}

	<!-- Add Form -->
	{#if showForm}
		<div class="card form-card fade-up">
			<h3>✨ New Scheduled Payment</h3>
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
						<label for="s-label" class="label">Label</label>
						<input
							id="s-label"
							class="input"
							name="label"
							placeholder="e.g. Netflix, Rent"
							required
						/>
					</div>
					<div class="field">
						<label for="s-amount" class="label">Amount</label>
						<input
							id="s-amount"
							class="input"
							name="amount"
							type="number"
							step="0.01"
							placeholder="0.00"
							required
						/>
					</div>
					<div class="field">
						<label for="s-cat" class="label">Category</label>
						<select id="s-cat" class="input" name="category">
							{#each categories as cat}
								<option value={cat}>{categoryEmoji[cat]} {cat}</option>
							{/each}
						</select>
					</div>
					<div class="field">
						<label for="s-freq" class="label">Frequency</label>
						<select id="s-freq" class="input" name="frequency">
							{#each frequencies as freq}
								<option value={freq}>{freq}</option>
							{/each}
						</select>
					</div>
					<div class="field">
						<label for="s-due" class="label">Next Due Date</label>
						<input
							id="s-due"
							class="input"
							name="nextDueDate"
							type="date"
							value={new Date().toISOString().split('T')[0]}
							required
						/>
					</div>
				</div>
				<div class="field">
					<label for="s-note" class="label">Note (optional)</label>
					<input id="s-note" class="input" name="note" placeholder="Add a note..." />
				</div>
				<button class="btn btn-violet full-btn" type="submit">Save Scheduled 📅</button>
			</form>
		</div>
	{/if}

	<!-- List -->
	<div class="items-list fade-up-2">
		{#if data.items.length === 0}
			<div class="empty-card card">
				<span>📅</span>
				<h3>No scheduled payments</h3>
				<p>Add recurring payments to never miss a due date!</p>
				<button class="btn btn-violet" onclick={() => (showForm = true)}>+ Add Scheduled</button>
			</div>
		{:else}
			{#each data.items as item, i}
				<div
					class="item-card card {item.isActive ? '' : 'inactive'}"
					style="animation-delay: {i * 0.04}s"
				>
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
							<h4 class="edit-title">✏️ Edit Scheduled</h4>
							<div class="form-grid">
								<div class="field">
									<label for="es-label" class="label">Label</label>
									<input id="es-label" class="input" name="label" value={item.label} required />
								</div>
								<div class="field">
									<label for="es-amount" class="label">Amount</label>
									<input
										id="es-amount"
										class="input"
										name="amount"
										type="number"
										step="0.01"
										value={item.amount}
										required
									/>
								</div>
								<div class="field">
									<label for="es-cat" class="label">Category</label>
									<select id="es-cat" class="input" name="category">
										{#each categories as cat}
											<option value={cat} selected={item.category === cat}
												>{categoryEmoji[cat]} {cat}</option
											>
										{/each}
									</select>
								</div>
								<div class="field">
									<label for="es-freq" class="label">Frequency</label>
									<select id="es-freq" class="input" name="frequency">
										{#each frequencies as freq}
											<option value={freq} selected={item.frequency === freq}>{freq}</option>
										{/each}
									</select>
								</div>
								<div class="field">
									<label for="es-due" class="label">Next Due Date</label>
									<input
										id="es-due"
										class="input"
										name="nextDueDate"
										type="date"
										value={item.nextDueDate.toISOString().split('T')[0]}
										required
									/>
								</div>
							</div>
							<div class="field">
								<label for="es-note" class="label">Note</label>
								<input id="es-note" class="input" name="note" value={item.note ?? ''} />
							</div>
							<div class="edit-actions">
								<button class="btn btn-violet" type="submit">Save</button>
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
									<span class="badge cat-badge">{categoryEmoji[item.category]} {item.category}</span
									>
									<span
										class="freq-badge"
										style="background:{freqColor[item.frequency]}20;color:{freqColor[
											item.frequency
										]}">{item.frequency}</span
									>
								</div>
								<div class="item-due-row">
									<p class="item-date">
										📅 {new Date(item.nextDueDate).toLocaleDateString('en-PH', {
											month: 'short',
											day: 'numeric',
											year: 'numeric'
										})}
									</p>
									<span class="due-chip">{daysUntil(item.nextDueDate)}</span>
								</div>
							</div>
							<div class="item-right">
								<p class="item-amount scheduled-amount">{fmt(parseFloat(item.amount))}</p>
								<div class="item-actions">
									<button class="icon-btn" onclick={() => (editingId = item.id)} title="Edit"
										>✏️</button
									>
									<form method="POST" action="?/toggle" use:enhance>
										<input type="hidden" name="id" value={item.id} />
										<input type="hidden" name="isActive" value={item.isActive ? 'true' : 'false'} />
										<button
											class="icon-btn toggle-btn"
											type="submit"
											title={item.isActive ? 'Pause' : 'Activate'}
										>
											{item.isActive ? '✅' : '⏸️'}
										</button>
									</form>
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
		padding: 24px 20px 100px;
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
	.scheduled-badge {
		background: var(--violet-light);
		color: var(--violet);
	}

	.header-actions {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
		align-items: center;
	}

	/* Violet button */
	.btn-violet {
		background: var(--violet);
		color: white;
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
		box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
	}
	.btn-violet:hover {
		background: #6d28d9;
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
	}
	.full-btn {
		width: 100%;
		justify-content: center;
		margin-top: 8px;
		padding: 13px;
		font-size: 14px;
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
		grid-template-columns: 1fr 1fr;
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
		transition:
			transform 0.15s,
			opacity 0.2s;
	}
	.item-card:hover {
		transform: translateY(-1px);
	}
	.inactive {
		opacity: 0.45;
	}

	.item-view {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.item-icon {
		width: 42px;
		height: 42px;
		background: var(--violet-light);
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
		margin-bottom: 4px;
		flex-wrap: wrap;
	}

	.cat-badge {
		background: var(--violet-light);
		color: var(--violet);
		padding: 2px 8px;
		border-radius: 99px;
		font-size: 11px;
		font-weight: 700;
	}
	.freq-badge {
		padding: 2px 8px;
		border-radius: 99px;
		font-size: 11px;
		font-weight: 700;
		text-transform: capitalize;
	}

	.item-due-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.item-date {
		font-size: 11px;
		color: var(--text-muted);
		font-weight: 600;
		margin: 0;
	}
	.due-chip {
		font-size: 11px;
		font-weight: 700;
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
	.scheduled-amount {
		color: var(--violet);
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
		background: var(--violet-light);
		transform: scale(1.1);
	}
	.icon-btn.danger:hover {
		background: var(--red-light);
	}
	.toggle-btn:hover {
		background: var(--green-light);
	}

	.edit-title {
		margin: 0 0 14px;
		font-size: 15px;
		color: var(--violet);
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

	@media (max-width: 600px) {
		.page {
			padding: 20px 16px 90px;
		}
		.form-grid {
			grid-template-columns: 1fr;
		}
		.filter-row {
			grid-template-columns: 1fr;
		}
		.summary-strip {
			padding: 12px 14px;
		}
		.summary-val {
			font-size: 12px;
		}
		.page-header h1 {
			font-size: 22px;
		}
		.due-chip {
			display: none;
		}
	}
</style>
