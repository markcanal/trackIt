import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { income, expenses, scheduled } from '$lib/server/db/schema.js';
import { eq, sum } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	const userId = session!.user.id;

	const [totalIncome, totalExpenses, scheduledItems] = await Promise.all([
		db
			.select({ total: sum(income.amount) })
			.from(income)
			.where(eq(income.userId, userId)),

		db
			.select({ total: sum(expenses.amount) })
			.from(expenses)
			.where(eq(expenses.userId, userId)),

		db.select().from(scheduled).where(eq(scheduled.userId, userId)).limit(5)
	]);

	return {
		totalIncome: Number(totalIncome[0]?.total ?? 0),
		totalExpenses: Number(totalExpenses[0]?.total ?? 0),
		scheduledItems
	};
};
