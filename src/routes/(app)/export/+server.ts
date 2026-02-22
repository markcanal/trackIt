import type { RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/server/auth.js';
import { db } from '$lib/server/db/index.js';
import { income, expenses, scheduled } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

function toCSV(headers: string[], rows: (string | number | boolean | null)[][]) {
	const escape = (val: string | number | boolean | null) => {
		const str = String(val ?? '');
		return str.includes(',') || str.includes('"') || str.includes('\n')
			? `"${str.replace(/"/g, '""')}"`
			: str;
	};
	return [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
}

export const GET: RequestHandler = async ({ request, url }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return new Response('Unauthorized', { status: 401 });

	const userId = session.user.id;
	const type = url.searchParams.get('type') ?? 'income';

	let csv = '';
	let filename = '';

	if (type === 'income') {
		const items = await db.select().from(income).where(eq(income.userId, userId));
		csv = toCSV(
			['ID', 'Label', 'Amount', 'Category', 'Note', 'Date'],
			items.map((i) => [
				i.id,
				i.label,
				i.amount,
				i.category,
				i.note,
				new Date(i.date).toLocaleDateString()
			])
		);
		filename = 'trackit-income.csv';
	} else if (type === 'expenses') {
		const items = await db.select().from(expenses).where(eq(expenses.userId, userId));
		csv = toCSV(
			['ID', 'Label', 'Amount', 'Category', 'Note', 'Date'],
			items.map((i) => [
				i.id,
				i.label,
				i.amount,
				i.category,
				i.note,
				new Date(i.date).toLocaleDateString()
			])
		);
		filename = 'trackit-expenses.csv';
	} else if (type === 'scheduled') {
		const items = await db.select().from(scheduled).where(eq(scheduled.userId, userId));
		csv = toCSV(
			['ID', 'Label', 'Amount', 'Category', 'Frequency', 'Next Due', 'Active', 'Note'],
			items.map((i) => [
				i.id,
				i.label,
				i.amount,
				i.category,
				i.frequency,
				new Date(i.nextDueDate).toLocaleDateString(),
				i.isActive,
				i.note
			])
		);
		filename = 'trackit-scheduled.csv';
	}

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
