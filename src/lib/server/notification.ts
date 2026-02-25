import { db } from '$lib/server/db/index.js';
import { fcmTokens } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { getMessaging } from 'firebase-admin/messaging';

export async function sendNotificationToUser(userId: string, title: string, body: string) {
	const tokens = await db.select().from(fcmTokens).where(eq(fcmTokens.userId, userId));

	if (tokens.length === 0) return;

	const messages = tokens.map(({ token }) => ({
		token,
		notification: { title, body },
		android: {
			priority: 'high' as const,
			notification: { sound: 'default' }
		}
	}));

	const messaging = getMessaging();
	for (const message of messages) {
		try {
			await messaging.send(message);
		} catch (e) {
			console.error('[FCM] Failed to send:', e);
		}
	}
}
