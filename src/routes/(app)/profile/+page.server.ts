import type { PageServerLoad, Actions } from './$types.js';
import { auth } from '$lib/server/auth.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	return { session };
};

export const actions: Actions = {
	updateName: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return fail(401, { error: 'Unauthorized.' });

		const form = await request.formData();
		const name = form.get('name')?.toString().trim();

		if (!name) return fail(400, { error: 'Name is required.' });

		await auth.api.updateUser({
			headers: request.headers,
			body: { name }
		});

		return { success: true };
	},

	changePassword: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return fail(401, { error: 'Unauthorized.' });

		const form = await request.formData();
		const currentPassword = form.get('currentPassword')?.toString();
		const newPassword = form.get('newPassword')?.toString();

		if (!currentPassword || !newPassword) {
			return fail(400, { error: 'Both fields are required.' });
		}

		if (newPassword.length < 8) {
			return fail(400, { error: 'New password must be at least 8 characters.' });
		}

		await auth.api.changePassword({
			headers: request.headers,
			body: { currentPassword, newPassword, revokeOtherSessions: true }
		});

		return { success: true };
	}
};
