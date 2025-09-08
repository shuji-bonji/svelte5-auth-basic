import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createUser, getUserByEmail, createSession, setSessionCookie } from '$lib/server/auth';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const name = data.get('name') as string | null;
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    // バリデーション
    if (!email || !password || !confirmPassword) {
      return fail(400, {
        email,
        name,
        error: 'すべての必須項目を入力してください'
      });
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, {
        email,
        name,
        error: '有効なメールアドレスを入力してください'
      });
    }

    // パスワードの長さチェック
    if (password.length < 6) {
      return fail(400, {
        email,
        name,
        error: 'パスワードは6文字以上で入力してください'
      });
    }

    // パスワード確認
    if (password !== confirmPassword) {
      return fail(400, {
        email,
        name,
        error: 'パスワードが一致しません'
      });
    }

    try {
      // 既存ユーザーチェック
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return fail(400, {
          email,
          name,
          error: 'このメールアドレスは既に登録されています'
        });
      }

      // ユーザー作成
      const user = await createUser(email, password, name || undefined);

      // セッション作成
      const sessionToken = await createSession(user.id);
      
      // Cookieにセッションを設定
      setSessionCookie(cookies, sessionToken);

      // ダッシュボードにリダイレクト
      throw redirect(303, '/dashboard');
    } catch (error) {
      if (error instanceof Response) {
        // リダイレクトの場合はそのまま投げる
        throw error;
      }
      
      console.error('Registration error:', error);
      return fail(500, {
        email,
        name,
        error: '登録中にエラーが発生しました。もう一度お試しください。'
      });
    }
  }
};