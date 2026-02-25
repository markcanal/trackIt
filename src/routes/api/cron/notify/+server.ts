import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db/index.js';
import { scheduled } from '$lib/server/db/schema.js';
import { sendNotificationToUser } from '$lib/server/notification';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ request }) => {
	// Protect with a secret key
	const authHeader = request.headers.get('Authorization');
	if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Find scheduled items due in the next 3 days
	const now = new Date();
	const threeDaysFromNow = new Date();
	threeDaysFromNow.setDate(now.getDate() + 3);

	const upcoming = await db.select().from(scheduled).where(eq(scheduled.isActive, true));

	const due = upcoming.filter((item) => {
		const dueDate = new Date(item.nextDueDate);
		return dueDate >= now && dueDate <= threeDaysFromNow;
	});

	for (const item of due) {
		const dueDate = new Date(item.nextDueDate);
		const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		await sendNotificationToUser(
			item.userId,
			'📅 Upcoming Payment',
			`${item.label} of ₱${item.amount} is due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
		);
	}

	return json({ notified: due.length });
};
