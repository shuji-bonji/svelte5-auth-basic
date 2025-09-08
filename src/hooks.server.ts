import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  // Cookieからセッショントークンを取得
  const sessionToken = event.cookies.get('session');
  
  if (sessionToken) {
    // セッションを検証してユーザー情報を取得
    const user = await validateSession(sessionToken);
    
    if (user) {
      // ユーザー情報をevent.localsに保存
      event.locals.user = user;
    }
  }
  
  // リクエストを処理
  const response = await resolve(event);
  
  return response;
};