import { boolean, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Reference to Better Auth's user table
const userId = () => text('user_id').notNull();

// ── Income ────────────────────────────────────────────────────
export const income = pgTable('income', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: userId(),
	label: text('label').notNull(),
	amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
	category: text('category').notNull().default('general'),
	note: text('note'),
	date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// ── Expenses ──────────────────────────────────────────────────
export const expenses = pgTable('expenses', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: userId(),
	label: text('label').notNull(),
	amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
	category: text('category').notNull().default('general'),
	note: text('note'),
	date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// ── Scheduled Expenses ────────────────────────────────────────
export const scheduled = pgTable('scheduled', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: userId(),
	label: text('label').notNull(),
	amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
	category: text('category').notNull().default('general'),
	note: text('note'),
	frequency: text('frequency').notNull().default('monthly'), // monthly | weekly | yearly
	nextDueDate: timestamp('next_due_date', { withTimezone: true }).notNull(),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const fcmTokens = pgTable('fcm_tokens', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ── Types ─────────────────────────────────────────────────────
export type Income = typeof income.$inferSelect;
export type NewIncome = typeof income.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type Scheduled = typeof scheduled.$inferSelect;
export type NewScheduled = typeof scheduled.$inferInsert;
export type FcmToken = typeof fcmTokens.$inferSelect;
export type NewFcmToken = typeof fcmTokens.$inferInsert;
