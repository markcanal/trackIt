<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let showForm = $state(false);

	const categories = ['general', 'rent', 'utilities', 'subscription', 'insurance', 'loan', 'other'];
	const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-PH', {
			style: 'currency',
			currency: 'PHP'
		}).format(amount);
	}

	function formatDate(date: string | Date) {
		return new Intl.DateTimeFormat('en-PH', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(new Date(date));
	}

	const totalActive = $derived(
		data.items
			.filter((i: any) => i.isActive)
			.reduce((sum: number, i: any) => sum + Number(i.amount), 0)
	);
</script>

<!-- Header -->
<div class="mb-6 flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-bold text-gray-800">Scheduled 📅</h1>
		<p class="text-sm text-gray-400">
			Active total: <span class="font-semibold text-violet-500">{formatCurrency(totalActive)}</span>
		</p>
	</div>
	<button
		onclick={() => (showForm = !showForm)}
		class="cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold
           text-white transition hover:bg-violet-700"
	>
		{showForm ? 'Cancel' : '+ Add'}
	</button>
</div>

<!-- Add Form -->
{#if showForm}
	<form
		method="POST"
		action="?/add"
		use:enhance={() => {
			return ({ update }) => {
				update();
				showForm = false;
			};
		}}
		class="mb-4 space-y-3 rounded-2xl bg-white p-4 shadow-sm"
	>
		{#if form?.error}
			<p class="text-sm text-red-400">{form.error}</p>
		{/if}

		<input
			name="label"
			placeholder="Label (e.g. Netflix, Rent)"
			required
			class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
		/>

		<input
			name="amount"
			type="number"
			step="0.01"
			min="0"
			placeholder="Amount"
			required
			class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
		/>

		<select
			name="category"
			class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
		>
			{#each categories as cat}
				<option value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
			{/each}
		</select>

		<select
			name="frequency"
			class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
		>
			{#each frequencies as freq}
				<option value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>
			{/each}
		</select>

		<input
			name="nextDueDate"
			type="date"
			required
			value={new Date().toISOString().split('T')[0]}
			class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
		/>

		<textarea
			name="note"
			placeholder="Note (optional)"
			rows="2"
			class="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
		></textarea>

		<button
			type="submit"
			class="w-full cursor-pointer rounded-xl bg-violet-600 py-3 text-sm font-semibold
             text-white transition hover:bg-violet-700"
		>
			Save Scheduled
		</button>
	</form>
{/if}

<!-- List -->
{#if data.items.length === 0}
	<div class="rounded-2xl bg-white p-8 text-center shadow-sm">
		<p class="mb-2 text-3xl">📅</p>
		<p class="text-sm text-gray-400">No scheduled expenses yet.</p>
	</div>
{:else}
	<div class="space-y-3">
		{#each data.items as item}
			<div
				class="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm
        {!item.isActive ? 'opacity-50' : ''}"
			>
				<div class="min-w-0 flex-1">
					<p class="truncate font-semibold text-gray-800">{item.label}</p>
					<p class="text-xs text-gray-400 capitalize">
						{item.category} · {item.frequency} · Due {formatDate(item.nextDueDate)}
					</p>
					{#if item.note}
						<p class="mt-0.5 truncate text-xs text-gray-400">{item.note}</p>
					{/if}
				</div>
				<div class="flex shrink-0 items-center gap-2">
					<p class="text-sm font-bold text-violet-500">{formatCurrency(Number(item.amount))}</p>

					<!-- Toggle -->
					<form method="POST" action="?/toggle" use:enhance>
						<input type="hidden" name="id" value={item.id} />
						<input type="hidden" name="isActive" value={String(item.isActive)} />
						<button
							type="submit"
							class="cursor-pointer text-lg transition"
							title={item.isActive ? 'Pause' : 'Activate'}
						>
							{item.isActive ? '✅' : '⏸️'}
						</button>
					</form>

					<!-- Delete -->
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={item.id} />
						<button
							type="submit"
							class="cursor-pointer text-lg text-gray-300 transition hover:text-red-400"
							aria-label="Delete"
						>
							🗑️
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
{/if}
