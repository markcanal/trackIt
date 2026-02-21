import type { PageServerLoad, Actions } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { scheduled } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	const userId = session!.user.id;

	const items = await db
		.select()
		.from(scheduled)
		.where(eq(scheduled.userId, userId))
		.orderBy(desc(scheduled.createdAt));

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
		const frequency = form.get('frequency')?.toString().trim() ?? 'monthly';
		const nextDueDate = form.get('nextDueDate')?.toString().trim();

		if (!label || !amount || !nextDueDate) {
			return fail(400, { error: 'Label, amount and due date are required.' });
		}

		await db.insert(scheduled).values({
			userId,
			label,
			amount,
			category,
			note,
			frequency,
			nextDueDate: new Date(nextDueDate)
		});

		return { success: true };
	},

	toggle: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return fail(401, { error: 'Unauthorized.' });

		const form = await request.formData();
		const id = form.get('id')?.toString();
		const current = form.get('isActive') === 'true';

		if (!id) return fail(400, { error: 'Missing id.' });

		await db.update(scheduled).set({ isActive: !current }).where(eq(scheduled.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return fail(401, { error: 'Unauthorized.' });

		const form = await request.formData();
		const id = form.get('id')?.toString();

		if (!id) return fail(400, { error: 'Missing id.' });

		await db.delete(scheduled).where(eq(scheduled.id, id));

		return { success: true };
	}
};
