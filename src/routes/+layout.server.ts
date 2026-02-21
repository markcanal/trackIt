import type { LayoutServerLoad } from './$types.js';
import { auth } from '$lib/server/auth.js';

export const load: LayoutServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	return { session };
};
