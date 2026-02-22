import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { income, expenses, scheduled } from '$lib/server/db/schema.js';
import { eq, sum, gte, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	const userId = session!.user.id;

	// Get date 6 months ago
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
	sixMonthsAgo.setDate(1);
	sixMonthsAgo.setHours(0, 0, 0, 0);

	const [totalIncome, totalExpenses, scheduledItems, allIncome, allExpenses] = await Promise.all([
		db
			.select({ total: sum(income.amount) })
			.from(income)
			.where(eq(income.userId, userId)),

		db
			.select({ total: sum(expenses.amount) })
			.from(expenses)
			.where(eq(expenses.userId, userId)),

		db.select().from(scheduled).where(eq(scheduled.userId, userId)).limit(5),

		db
			.select({ amount: income.amount, date: income.date })
			.from(income)
			.where(and(eq(income.userId, userId), gte(income.date, sixMonthsAgo))),

		db
			.select({ amount: expenses.amount, date: expenses.date })
			.from(expenses)
			.where(and(eq(expenses.userId, userId), gte(expenses.date, sixMonthsAgo)))
	]);

	// Build monthly buckets for last 6 months
	const months: { label: string; income: number; expenses: number }[] = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date();
		d.setMonth(d.getMonth() - i);
		months.push({
			label: d.toLocaleString('en-PH', { month: 'short', year: '2-digit' }),
			income: 0,
			expenses: 0
		});
	}

	allIncome.forEach(({ amount, date }) => {
		const d = new Date(date);
		const label = d.toLocaleString('en-PH', { month: 'short', year: '2-digit' });
		const bucket = months.find((m) => m.label === label);
		if (bucket) bucket.income += Number(amount);
	});

	allExpenses.forEach(({ amount, date }) => {
		const d = new Date(date);
		const label = d.toLocaleString('en-PH', { month: 'short', year: '2-digit' });
		const bucket = months.find((m) => m.label === label);
		if (bucket) bucket.expenses += Number(amount);
	});

	return {
		totalIncome: Number(totalIncome[0]?.total ?? 0),
		totalExpenses: Number(totalExpenses[0]?.total ?? 0),
		scheduledItems,
		monthlyData: months
	};
};
