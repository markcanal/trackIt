import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import * as authSchema from './auth.schema.js';
import { env } from '$env/dynamic/private';

const client = postgres(env.DATABASE_URL, {
	ssl: false
});

export const db = drizzle(client, {
	schema: { ...schema, ...authSchema }
});
