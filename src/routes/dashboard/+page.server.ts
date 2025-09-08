import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // 認証チェック
  if (!locals.user) {
    throw redirect(303, '/login?from=/dashboard');
  }
  
  return {
    user: locals.user
  };
};