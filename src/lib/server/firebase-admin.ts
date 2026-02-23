import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/auth.schema.js';
import { eq } from 'drizzle-orm';

if (!getApps().length) {
	initializeApp({
		credential: cert({
			projectId: env.FIREBASE_PROJECT_ID,
			clientEmail: env.FIREBASE_CLIENT_EMAIL,
			privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
		})
	});
}

export async function verifyFirebaseToken(request: Request) {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader?.startsWith('Bearer ')) return null;
	const token = authHeader.split('Bearer ')[1];

	try {
		const decoded = await getAuth().verifyIdToken(token);
		const email = decoded.email;

		if (!email) {
			// No email (anonymous) — just use Firebase UID
			return { uid: decoded.uid };
		}

		// Check if user already exists in DB by email
		const existing = await db.select().from(user).where(eq(user.email, email)).limit(1);

		if (existing.length > 0) {
			// Use existing Better Auth user ID — data shared with web!
			return { uid: existing[0].id, email };
		}

		// New user — create record in DB
		const [newUser] = await db
			.insert(user)
			.values({
				id: decoded.uid,
				name: decoded.name ?? email.split('@')[0],
				email,
				emailVerified: decoded.email_verified ?? false,
				image: decoded.picture ?? null,
				isAnonymous: false,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.onConflictDoNothing()
			.returning();

		return { uid: newUser?.id ?? decoded.uid, email };
	} catch (e) {
		console.error('[Firebase Admin] Token verification failed:', e);
		return null;
	}
}
