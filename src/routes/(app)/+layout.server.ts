import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth.js';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		redirect(302, '/auth');
	}

	return { session };
};
