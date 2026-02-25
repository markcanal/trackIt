import { db } from '$lib/server/db/index.js';
import { fcmTokens } from '$lib/server/db/schema.js';
import { verifyFirebaseToken } from '$lib/server/firebase-admin.js';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const user = await verifyFirebaseToken(request);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { token } = await request.json();
	if (!token) return json({ error: 'Missing token' }, { status: 400 });

	await db
		.insert(fcmTokens)
		.values({ userId: user.uid, token })
		.onConflictDoUpdate({
			target: fcmTokens.token,
			set: { userId: user.uid }
		});

	return json({ success: true });
};
