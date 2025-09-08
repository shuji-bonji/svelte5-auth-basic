# Svelte 5 認証システム実装ガイド

このドキュメントは、Svelte 5とSvelteKitを使用した認証システムの実装手順を記録したものです。

## 📋 実装の全体フロー

### 1. プロジェクトの初期セットアップ

#### 1.1 プロジェクト作成
```bash
npm create vite@latest svelte5-auth-basic -- --template svelte-ts
cd svelte5-auth-basic
npm install
```

#### 1.2 SvelteKit変換
```bash
npx svelte-migrate@latest sveltekit
npm install
```

#### 1.3 必要なパッケージのインストール
```bash
# 認証関連
npm install bcryptjs
npm install -D @types/bcryptjs

# データベース（Prisma）
npm install @prisma/client
npm install -D prisma

# Vercelアダプター
npm install -D @sveltejs/adapter-vercel
```

### 2. データベースセットアップ

#### 2.1 Prisma初期化
```bash
npx prisma init --datasource-provider sqlite
```

#### 2.2 スキーマ定義（prisma/schema.prisma）
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // 開発環境
  // provider = "postgresql"  // 本番環境
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  sessions  Session[]
}

model Session {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

#### 2.3 データベースマイグレーション
```bash
# 開発環境（SQLite）
npx prisma migrate dev --name init

# 本番環境（PostgreSQL）への適用
npx prisma db push
```

### 3. 認証システムの実装

#### 3.1 認証ユーティリティ（src/lib/server/auth.ts）
主要な機能：
- `hashPassword()` - bcryptでパスワードをハッシュ化
- `verifyPassword()` - パスワード検証
- `createUser()` - ユーザー作成
- `createSession()` - セッション作成（7日間有効）
- `validateSession()` - セッション検証
- `deleteSession()` - セッション削除
- `setSessionCookie()` - HTTPOnlyクッキー設定

#### 3.2 Hooksでのセッション管理（src/hooks.server.ts）
```typescript
export const handle: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
  
  if (sessionToken) {
    const { user, session } = await validateSession(sessionToken);
    if (user) {
      event.locals.user = user;
      event.locals.session = session;
    }
  }
  
  return resolve(event);
};
```

### 4. ページ実装

#### 4.1 登録ページ（/register）
- **Form Actions**でサーバーサイド処理
- バリデーション（メール形式、パスワード長、確認一致）
- 既存ユーザーチェック
- 成功時は自動ログイン→ダッシュボードへ

#### 4.2 ログインページ（/login）
- メールアドレスとパスワードで認証
- セッション作成とクッキー設定
- リダイレクト先の制御（fromパラメータ）

#### 4.3 ダッシュボード（/dashboard）
- 認証保護（+page.server.tsでチェック）
- ユーザー情報表示
- ログアウト機能

### 5. UI/UXの改善

#### 5.1 ダークモード対応
```css
input, textarea {
  background: var(--color-bg-1);
  color: var(--color-text);  /* 重要：ダークモードでの視認性 */
}
```

#### 5.2 レスポンシブデザイン
- モバイル対応のフォームレイアウト
- 適切なパディングとマージン

### 6. エラーハンドリング

#### 6.1 Form Actionsでのリダイレクト処理
```typescript
} catch (error: any) {
  // リダイレクトの場合はそのまま投げる（重要）
  if (error && typeof error === 'object' && 
      'status' in error && 'location' in error) {
    throw error;
  }
  // その他のエラー処理
}
```

#### 6.2 Prismaエラーの詳細化
```typescript
if (error?.code === 'P2002') {
  errorMessage = 'このメールアドレスは既に登録されています';
} else if (error?.code?.startsWith('P')) {
  errorMessage = 'データベースエラーが発生しました';
}
```

### 7. Vercelデプロイ設定

#### 7.1 アダプター設定（svelte.config.js）
```javascript
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x'
    })
  }
};
```

#### 7.2 ビルド設定（package.json）
```json
{
  "scripts": {
    "build": "prisma generate && vite build",
    "postinstall": "prisma generate"
  }
}
```

#### 7.3 Vercel設定（vercel.json）
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".vercel/output",
  "framework": "sveltekit"
}
```

### 8. 環境変数管理

#### 8.1 開発環境（.env）
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

#### 8.2 本番環境（.env.local / Vercel環境変数）
```env
DATABASE_URL="postgresql://..."  # Neon PostgreSQL
SESSION_SECRET="ランダムな文字列"
```

### 9. データベース移行（SQLite → PostgreSQL）

#### 9.1 Neonデータベース作成
1. Vercelダッシュボードから「Storage」
2. 「Create Database」→「Neon Serverless Postgres」
3. リージョン：Singapore（ap-southeast-1）
4. データベース名：任意（例：svelte5-auth-basic）

#### 9.2 スキーマ適用
```bash
# PostgreSQL用スキーマに切り替え
cp prisma/schema.postgres.prisma prisma/schema.prisma

# スキーマを適用
npx prisma db push
```

## 🔧 トラブルシューティング

### よくある問題と解決策

#### 1. "bcrypt is not a function"エラー
**解決**: bcryptjsを使用（Pure JavaScript実装）
```javascript
import bcrypt from 'bcryptjs';  // bcryptではなくbcryptjs
```

#### 2. Form Actionsでリダイレクトが失敗
**解決**: エラーハンドリングでリダイレクトを適切に処理
```typescript
if (error?.status === 303) throw error;
```

#### 3. ダークモードで入力値が見えない
**解決**: CSSで`color: var(--color-text)`を追加

#### 4. Vercelビルドエラー
**解決**: 
- `prisma generate`をビルドスクリプトに追加
- `postinstall`フックを設定

#### 5. SESSION_SECRETが空
**解決**: 
- ローカル：.env.localに手動で値を設定
- Vercel：環境変数に追加

## 📚 参考リンク

- [Svelte 5 Docs](https://svelte.dev/docs)
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs/introduction)
- [Vercel Docs](https://vercel.com/docs)

## 🚀 デプロイURL

- **本番環境**: https://svelte5-auth-basic.vercel.app
- **GitHubリポジトリ**: https://github.com/shuji-bonji/svelte5-auth-basic

## 📝 今後の改善案

1. **メール認証**の実装
2. **パスワードリセット**機能
3. **プロフィール編集**機能
4. **ソーシャルログイン**（Google、GitHub等）
5. **2要素認証**
6. **レート制限**（ブルートフォース対策）
7. **セッション管理UI**（ログイン中のデバイス一覧）
8. **監査ログ**（ログイン履歴）

---

*最終更新: 2025年9月9日*