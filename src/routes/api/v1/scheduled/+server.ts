import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { scheduled } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { verifyFirebaseToken } from '$lib/server/firebase-admin.js';

export const GET: RequestHandler = async ({ request }) => {
	const user = await verifyFirebaseToken(request);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const items = await db
		.select()
		.from(scheduled)
		.where(eq(scheduled.userId, user.uid))
		.orderBy(desc(scheduled.createdAt));

	return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
	const user = await verifyFirebaseToken(request);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const { label, amount, category, note, frequency, nextDueDate } = body;

	if (!label || !amount || !nextDueDate) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const [item] = await db
		.insert(scheduled)
		.values({
			userId: user.uid,
			label,
			amount: String(amount),
			category: category ?? 'general',
			note: note ?? null,
			frequency: frequency ?? 'monthly',
			nextDueDate: new Date(nextDueDate)
		})
		.returning();

	return json(item, { status: 201 });
};

export const DELETE: RequestHandler = async ({ request, url }) => {
	const user = await verifyFirebaseToken(request);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const id = url.searchParams.get('id');
	if (!id) return json({ error: 'Missing id' }, { status: 400 });

	await db.delete(scheduled).where(eq(scheduled.id, id));
	return json({ success: true });
};

export const PATCH: RequestHandler = async ({ request, url }) => {
	const user = await verifyFirebaseToken(request);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const id = url.searchParams.get('id');
	if (!id) return json({ error: 'Missing id' }, { status: 400 });

	const body = await request.json();
	const { label, amount, category, note, nextDueDate } = body;

	const [item] = await db
		.update(scheduled)
		.set({ label, amount: String(amount), category, note, nextDueDate: new Date(nextDueDate) })
		.where(eq(scheduled.id, id))
		.returning();

	return json(item);
};
