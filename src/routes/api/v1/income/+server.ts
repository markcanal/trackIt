import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { income } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { verifyFirebaseToken } from '$lib/server/firebase-admin.js';

export const GET: RequestHandler = async ({ request }) => {
	const user = await verifyFirebaseToken(request);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const items = await db
		.select()
		.from(income)
		.where(eq(income.userId, user.uid))
		.orderBy(desc(income.date));

	return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
	const user = await verifyFirebaseToken(request);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const { label, amount, category, note, date } = body;

	if (!label || !amount || !date) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const [item] = await db
		.insert(income)
		.values({
			userId: user.uid,
			label,
			amount: String(amount),
			category: category ?? 'general',
			note: note ?? null,
			date: new Date(date)
		})
		.returning();

	return json(item, { status: 201 });
};

export const DELETE: RequestHandler = async ({ request, url }) => {
	const user = await verifyFirebaseToken(request);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const id = url.searchParams.get('id');
	if (!id) return json({ error: 'Missing id' }, { status: 400 });

	await db.delete(income).where(eq(income.id, id));
	return json({ success: true });
};
