import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSession, deleteSessionCookie } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
  const sessionToken = cookies.get('session');
  
  if (sessionToken) {
    // データベースからセッションを削除
    await deleteSession(sessionToken);
  }
  
  // Cookieを削除
  deleteSessionCookie(cookies);
  
  // ホームページにリダイレクト
  throw redirect(303, '/');
};