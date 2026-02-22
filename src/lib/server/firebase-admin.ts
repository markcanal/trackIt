import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from '$env/dynamic/private';

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
		return decoded;
	} catch {
		return null;
	}
}
