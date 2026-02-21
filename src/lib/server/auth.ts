import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { anonymous } from 'better-auth/plugins';
import { db } from './db/index.js';
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),

	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,

	emailAndPassword: {
		enabled: true
	},

	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID ?? '',
			clientSecret: env.GOOGLE_CLIENT_SECRET ?? ''
		}
	},

	plugins: [
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				// We'll wire up an email provider later
				// For now just log it for testing
				console.log(`[Magic Link] ${email} → ${url}`);
			}
		}),
		anonymous()
	]
});

export type Auth = typeof auth;
