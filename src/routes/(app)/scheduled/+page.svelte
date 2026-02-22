<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let showForm = $state(false);
	let editingId = $state<string | null>(null);

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

	function toInputDate(date: string | Date) {
		return new Date(date).toISOString().split('T')[0];
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
	<div class="flex gap-2">
		<a
			href="/export?type=scheduled"
			class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-500
             transition hover:bg-gray-50"
			download
		>
			⬇️ CSV
		</a>
		<button
			onclick={() => {
				showForm = !showForm;
				editingId = null;
			}}
			class="cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold
             text-white transition hover:bg-violet-700"
		>
			{showForm ? 'Cancel' : '+ Add'}
		</button>
	</div>
</div>

<!-- Filters -->
<form method="GET" class="mb-4 space-y-3 rounded-2xl bg-white p-4 shadow-sm">
	<p class="text-sm font-semibold text-gray-600">Filter</p>
	<select
		name="category"
		class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
	>
		<option value="">All Categories</option>
		{#each categories as cat}
			<option value={cat} selected={data.filters.category === cat}>
				{cat.charAt(0).toUpperCase() + cat.slice(1)}
			</option>
		{/each}
	</select>
	<select
		name="frequency"
		class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
	>
		<option value="">All Frequencies</option>
		{#each frequencies as freq}
			<option value={freq} selected={data.filters.frequency === freq}>
				{freq.charAt(0).toUpperCase() + freq.slice(1)}
			</option>
		{/each}
	</select>
	<div class="flex gap-2">
		<button
			type="submit"
			class="flex-1 cursor-pointer rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
		>
			Apply
		</button>
		<a
			href="/scheduled"
			class="flex-1 rounded-xl border border-gray-200 py-2 text-center text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
		>
			Clear
		</a>
	</div>
</form>

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
			class="w-full cursor-pointer rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
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
			{#if editingId === item.id}
				<!-- Edit Form -->
				<form
					method="POST"
					action="?/edit"
					use:enhance={() => {
						return ({ update }) => {
							update();
							editingId = null;
						};
					}}
					class="space-y-3 rounded-2xl border-2 border-violet-200 bg-white p-4 shadow-sm"
				>
					<input type="hidden" name="id" value={item.id} />
					<input
						name="label"
						value={item.label}
						required
						class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
					/>
					<input
						name="amount"
						type="number"
						step="0.01"
						min="0"
						value={Number(item.amount)}
						required
						class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
					/>
					<select
						name="category"
						class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
					>
						{#each categories as cat}
							<option value={cat} selected={cat === item.category}
								>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option
							>
						{/each}
					</select>
					<select
						name="frequency"
						class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
					>
						{#each frequencies as freq}
							<option value={freq} selected={freq === item.frequency}
								>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option
							>
						{/each}
					</select>
					<input
						name="nextDueDate"
						type="date"
						value={toInputDate(item.nextDueDate)}
						required
						class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
					/>
					<textarea
						name="note"
						rows="2"
						class="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-violet-500"
						>{item.note ?? ''}</textarea
					>
					<div class="flex gap-2">
						<button
							type="submit"
							class="flex-1 cursor-pointer rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
						>
							Save Changes
						</button>
						<button
							type="button"
							onclick={() => (editingId = null)}
							class="flex-1 cursor-pointer rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
						>
							Cancel
						</button>
					</div>
				</form>
			{:else}
				<!-- Item Card -->
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
						<button
							onclick={() => (editingId = item.id)}
							class="cursor-pointer text-lg text-gray-300 transition hover:text-violet-400"
							aria-label="Edit"
						>
							✏️
						</button>
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
			{/if}
		{/each}
	</div>
{/if}
