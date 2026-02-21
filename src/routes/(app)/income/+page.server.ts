import type { PageServerLoad, Actions } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { income } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	const userId = session!.user.id;

	const items = await db
		.select()
		.from(income)
		.where(eq(income.userId, userId))
		.orderBy(desc(income.date));

	return { items };
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

		await db.insert(income).values({
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

		await db.delete(income).where(eq(income.id, id));

		return { success: true };
	}
};
