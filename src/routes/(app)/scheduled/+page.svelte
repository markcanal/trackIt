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
</script>

<div class="page">
	<div
		class="blob"
		style="width:350px;height:350px;background:#e0e7ff;top:-60px;right:-60px;opacity:0.15"
	></div>
	<!-- Header -->
	<div class="page-header fade-up">
		<div>
			<h1>Scheduled 📅</h1>
			<p class="total-badge scheduled-badge">Active total: {fmt(totalActive)}</p>
		</div>
		<div class="header-actions">
			<a href="/export?type=scheduled" class="btn btn-ghost" download>⬇️ CSV</a>
			<button class="btn btn-ghost" onclick={() => (showFilters = !showFilters)}>
				🔍 {showFilters ? 'Hide' : 'Filter'}
			</button>
			<button
				class="btn btn-primary"
				onclick={() => {
					showForm = !showForm;
					editingId = null;
				}}
			>
				{showForm ? '✕ Cancel' : '+ Add'}
			</button>
		</div>
	</div>
	<!-- Filter Panel -->
	{#if showFilters}
		<div class="card filter-card fade-up">
			<form method="GET" class="filter-form">
				<div class="filter-row">
					<div class="field">
						<label for="category" class="label">Category</label>
						<select id="category" class="input" name="category">
							<option value="">All</option>
							{#each categories as cat}
								<option value={cat} selected={data.filters?.category === cat}>
									{categoryEmoji[cat]}
									{cat}
								</option>
							{/each}
						</select>
					</div>
					<div class="field">
						<label for="frequency" class="label">Frequency</label>
						<select id="frequency" class="input" name="frequency">
							<option value="">All</option>
							{#each frequencies as freq}
								<option value={freq} selected={data.filters?.frequency === freq}>{freq}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="filter-actions">
					<button class="btn btn-primary" type="submit">Apply Filters</button>
					<a href="/scheduled" class="btn btn-ghost">Clear</a>
				</div>
			</form>
		</div>
	{/if}
	<!-- Add Form -->
	{#if showForm}
		<div class="card form-card fade-up">
			<h3>✨ New Scheduled</h3>
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
						<label for="label" class="label">Label</label>
						<input
							id="label"
							class="input"
							name="label"
							placeholder="e.g. Netflix, Rent"
							required
						/>
					</div>
					<div class="field">
						<label for="amount" class="label">Amount</label>
						<input
							id="amount"
							class="input"
							name="amount"
							type="number"
							step="0.01"
							placeholder="0.00"
							required
						/>
					</div>
					<div class="field">
						<label for="category" class="label">Category</label>
						<select id="category" class="input" name="category">
							{#each categories as cat}
								<option value={cat}>{categoryEmoji[cat]} {cat}</option>
							{/each}
						</select>
					</div>
					<div class="field">
						<label for="frequency" class="label">Frequency</label>
						<select id="frequency" class="input" name="frequency">
							{#each frequencies as freq}
								<option value={freq}>{freq}</option>
							{/each}
						</select>
					</div>
					<div class="field">
						<label for="nextDueDate" class="label">Next Due Date</label>
						<input
							id="nextDueDate"
							class="input"
							name="nextDueDate"
							type="date"
							value={new Date().toISOString().split('T')[0]}
							required
						/>
					</div>
				</div>
				<div class="field">
					<label for="note" class="label">Note (optional)</label>
					<input id="note" class="input" name="note" placeholder="Add a note..." />
				</div>
				<button class="btn btn-primary" type="submit" style="margin-top:8px"
					>Save Scheduled 📅</button
				>
			</form>
		</div>
	{/if}
	<!-- List -->
	<div class="items-list fade-up-2">
		{#if data.items.length === 0}
			<div class="empty-card card">
				<span>📅</span>
				<h3>No scheduled yet</h3>
				<p>Add your first scheduled entry to get started!</p>
				<button class="btn btn-primary" onclick={() => (showForm = true)}>+ Add Scheduled</button>
			</div>
		{:else}
			{#each data.items as item, i}
				<div
					class="item-card card {item.isActive ? '' : 'inactive'}"
					style="animation-delay: {i * 0.05}s"
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
									<label for="edit-label" class="label">Label</label>
									<input id="edit-label" class="input" name="label" value={item.label} required />
								</div>
								<div class="field">
									<label for="edit-amount" class="label">Amount</label>
									<input
										id="edit-amount"
										class="input"
										name="amount"
										type="number"
										step="0.01"
										value={item.amount}
										required
									/>
								</div>
								<div class="field">
									<label for="edit-category" class="label">Category</label>
									<select id="edit-category" class="input" name="category">
										{#each categories as cat}
											<option value={cat} selected={item.category === cat}
												>{categoryEmoji[cat]} {cat}</option
											>
										{/each}
									</select>
								</div>
								<div class="field">
									<label for="edit-frequency" class="label">Frequency</label>
									<select id="edit-frequency" class="input" name="frequency">
										{#each frequencies as freq}
											<option value={freq} selected={item.frequency === freq}>{freq}</option>
										{/each}
									</select>
								</div>
								<div class="field">
									<label for="edit-nextDueDate" class="label">Next Due Date</label>
									<input
										id="edit-nextDueDate"
										class="input"
										name="nextDueDate"
										type="date"
										value={item.nextDueDate.toISOString().split('T')[0]}
										required
									/>
								</div>
							</div>
							<div class="field">
								<label for="edit-note" class="label">Note</label>
								<input id="edit-note" class="input" name="note" value={item.note ?? ''} />
							</div>
							<div class="edit-actions">
								<button class="btn btn-primary" type="submit">Save</button>
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
									<span class="badge" style="background:var(--violet-light);color:var(--violet)"
										>{item.category}</span
									>
									<span class="badge" style="background:var(--surface2);color:var(--text)"
										>{item.frequency}</span
									>
									{#if item.note}<span class="item-note">{item.note}</span>{/if}
								</div>
								<p class="item-date">
									Due {new Date(item.nextDueDate).toLocaleDateString('en-PH', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</p>
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
											class="icon-btn"
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
		padding: 32px;
		max-width: 800px;
		position: relative;
	}
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 24px;
		gap: 16px;
	}
	.page-header h1 {
		font-size: 28px;
		margin: 0 0 6px;
	}
	.total-badge {
		display: inline-flex;
		padding: 4px 14px;
		border-radius: 99px;
		font-size: 13px;
		font-weight: 700;
		margin: 0;
	}
	.scheduled-badge {
		background: var(--violet-light);
		color: var(--violet);
	}
	.header-actions {
		display: flex;
		gap: 10px;
		flex-shrink: 0;
	}
	.filter-card {
		padding: 20px;
		margin-bottom: 16px;
	}
	.filter-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.filter-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}
	.filter-actions {
		display: flex;
		gap: 10px;
	}
	.form-card {
		padding: 24px;
		margin-bottom: 16px;
	}
	.form-card h3 {
		margin: 0 0 20px;
		font-size: 18px;
	}
	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-bottom: 12px;
	}
	.field {
		display: flex;
		flex-direction: column;
	}
	.items-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.item-card {
		padding: 18px 20px;
		animation: fadeUp 0.3s ease both;
	}
	.item-view {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.item-icon {
		width: 44px;
		height: 44px;
		background: var(--violet-light);
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		flex-shrink: 0;
	}
	.item-info {
		flex: 1;
		min-width: 0;
	}
	.item-label {
		font-size: 15px;
		font-weight: 700;
		margin: 0 0 4px;
	}
	.item-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
		flex-wrap: wrap;
	}
	.item-note {
		font-size: 12px;
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
		gap: 8px;
		flex-shrink: 0;
	}
	.item-amount {
		font-size: 17px;
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
		width: 32px;
		height: 32px;
		border-radius: 10px;
		border: none;
		background: var(--surface2);
		cursor: pointer;
		font-size: 14px;
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
	.edit-title {
		margin: 0 0 16px;
		font-size: 16px;
	}
	.edit-actions {
		display: flex;
		gap: 10px;
		margin-top: 12px;
	}
	.empty-card {
		padding: 48px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.empty-card span {
		font-size: 48px;
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
	.inactive {
		opacity: 0.5;
	}
	@media (max-width: 640px) {
		.page {
			padding: 20px 16px;
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
