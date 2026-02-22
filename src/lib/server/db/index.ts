import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import * as authSchema from './auth.schema.js';
import { env } from '$env/dynamic/private';

const isProduction = env.NODE_ENV === 'production';

const client = postgres(env.DATABASE_URL, {
	ssl: isProduction ? 'require' : false
	// max: 10,
	// connection: {
	//   family: 4  // force IPv4
	// }
});

export const db = drizzle(client, {
	schema: { ...schema, ...authSchema }
});
