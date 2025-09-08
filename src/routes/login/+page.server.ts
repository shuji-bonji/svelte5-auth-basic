import { fail, redirect, type Redirect } from '@sveltejs/kit';
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
      console.log('ログイン試行:', email);
      
      // ユーザーを取得
      const user = await getUserByEmail(email);
      
      if (!user) {
        console.log('ユーザーが見つかりません:', email);
        return fail(401, {
          email,
          error: 'メールアドレスまたはパスワードが正しくありません'
        });
      }
      
      console.log('ユーザー取得成功:', user.id);

      // パスワードを検証
      const isValid = await verifyPassword(password, user.password);
      console.log('パスワード検証結果:', isValid);
      
      if (!isValid) {
        return fail(401, {
          email,
          error: 'メールアドレスまたはパスワードが正しくありません'
        });
      }

      // セッション作成
      const sessionToken = await createSession(user.id);
      console.log('セッション作成成功:', sessionToken);
      
      // Cookieにセッションを設定
      setSessionCookie(cookies, sessionToken);

      // リダイレクト先を決定（from パラメータがあればそこへ、なければダッシュボードへ）
      const redirectTo = url.searchParams.get('from') || '/dashboard';
      console.log('リダイレクト先:', redirectTo);
      throw redirect(303, redirectTo);
    } catch (error: any) {
      // リダイレクトの場合はそのまま投げる
      if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
        console.log('リダイレクト検出 - 正常動作:', error.location);
        throw error;
      }
      
      console.error('Login failed - 詳細エラー:', error);
      console.error('エラースタック:', error instanceof Error ? error.stack : 'スタックなし');
      console.error('Error details:', {
        message: error?.message,
        code: error?.code
      });
      
      // エラーメッセージの詳細化
      let errorMessage = 'ログイン中にエラーが発生しました。もう一度お試しください。';
      if (error?.code?.startsWith('P')) {
        errorMessage = 'データベースエラーが発生しました。しばらくしてからお試しください。';
      }
      
      return fail(500, {
        email,
        error: errorMessage
      });
    }
  }
};