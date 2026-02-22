import type { PageServerLoad, Actions } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { expenses } from '$lib/server/db/schema.js';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth.js';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { session } = await parent();
	const userId = session!.user.id;

	const category = url.searchParams.get('category') ?? '';
	const from = url.searchParams.get('from') ?? '';
	const to = url.searchParams.get('to') ?? '';

	const filters = [eq(expenses.userId, userId)];
	if (category) filters.push(eq(expenses.category, category));
	if (from) filters.push(gte(expenses.date, new Date(from)));
	if (to) filters.push(lte(expenses.date, new Date(to)));

	const items = await db
		.select()
		.from(expenses)
		.where(and(...filters))
		.orderBy(desc(expenses.date));

	return { items, filters: { category, from, to } };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return fail(401, { error: 'Unauthorized.' });
		const userId = session.user.id;

		const form = await request.formData();
		const label = form.get('label')?.toString().trim();
		const amount = form.get('amount')?.toString().trim();
		const category = form.get('category')?.toString().trim() ?? 'general';
		const note = form.get('note')?.toString().trim() ?? null;
		const date = form.get('date')?.toString().trim();

		if (!label || !amount || !date) {
			return fail(400, { error: 'Label, amount and date are required.' });
		}

		await db.insert(expenses).values({
			userId,
			label,
			amount,
			category,
			note,
			date: new Date(date)
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return fail(401, { error: 'Unauthorized.' });

		const form = await request.formData();
		const id = form.get('id')?.toString();

		if (!id) return fail(400, { error: 'Missing id.' });

		await db.delete(expenses).where(eq(expenses.id, id));

		return { success: true };
	},
	edit: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return fail(401, { error: 'Unauthorized.' });

		const form = await request.formData();
		const id = form.get('id')?.toString();
		const label = form.get('label')?.toString().trim();
		const amount = form.get('amount')?.toString().trim();
		const category = form.get('category')?.toString().trim() ?? 'general';
		const note = form.get('note')?.toString().trim() ?? null;
		const date = form.get('date')?.toString().trim();

		if (!id || !label || !amount || !date) {
			return fail(400, { error: 'All fields required.' });
		}

		await db
			.update(expenses)
			.set({ label, amount, category, note, date: new Date(date) })
			.where(eq(expenses.id, id));

		return { success: true };
	}
};
