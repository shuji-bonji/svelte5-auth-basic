import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getUserByEmail, verifyPassword, createSession, setSessionCookie } from '$lib/server/auth';

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    // バリデーション
    if (!email || !password) {
      return fail(400, {
        email,
        error: 'メールアドレスとパスワードを入力してください'
      });
    }

    try {
      // ユーザーを取得
      const user = await getUserByEmail(email);
      
      if (!user) {
        return fail(401, {
          email,
          error: 'メールアドレスまたはパスワードが正しくありません'
        });
      }

      // パスワードを検証
      const isValid = await verifyPassword(password, user.password);
      
      if (!isValid) {
        return fail(401, {
          email,
          error: 'メールアドレスまたはパスワードが正しくありません'
        });
      }

      // セッション作成
      const sessionToken = await createSession(user.id);
      
      // Cookieにセッションを設定
      setSessionCookie(cookies, sessionToken);

      // リダイレクト先を決定（from パラメータがあればそこへ、なければダッシュボードへ）
      const redirectTo = url.searchParams.get('from') || '/dashboard';
      throw redirect(303, redirectTo);
    } catch (error) {
      if (error instanceof Response) {
        // リダイレクトの場合はそのまま投げる
        throw error;
      }
      
      console.error('Login error:', error);
      return fail(500, {
        email,
        error: 'ログイン中にエラーが発生しました。もう一度お試しください。'
      });
    }
  }
};