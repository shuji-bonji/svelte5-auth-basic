# Svelte 5 Auth Basic

Svelte 5とSvelteKitで構築したCookie/Sessionベースの認証システム実装例です。

## 🚀 デモサイト

[準備中 - Vercelにデプロイ予定]

## ✨ 特徴

- **Cookie/Session認証**: セキュアなセッション管理
- **Svelte 5 Runes**: 最新のリアクティビティシステム
- **TypeScript**: 完全な型安全性
- **Prisma + SQLite**: 型安全なデータベースアクセス
- **Form Actions**: プログレッシブエンハンスメント対応
- **bcrypt**: セキュアなパスワードハッシュ化

## 🛠 技術スタック

- **フレームワーク**: Svelte 5 + SvelteKit 2
- **言語**: TypeScript
- **データベース**: SQLite (開発) / PostgreSQL (本番)
- **ORM**: Prisma
- **認証**: Cookie/Session (カスタム実装)
- **スタイリング**: CSS Variables
- **パスワード**: bcryptjs

## 📦 インストール

```bash
# リポジトリのクローン
git clone https://github.com/shuji-bonji/svelte5-auth-basic.git
cd svelte5-auth-basic

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してJWT_SECRETを設定

# データベースのセットアップ
npx prisma db push

# 開発サーバーの起動
npm run dev
```

## 🔧 データベースの管理

### データベースのリフレッシュ（再構築）

開発中にデータベースを初期状態に戻したい場合：

```bash
# SQLiteデータベースファイルを削除
rm -f prisma/dev.db
rm -f prisma/dev.db-journal

# データベースを再作成してスキーマを適用
npx prisma db push

# または、マイグレーションを使用する場合
npx prisma migrate reset
```

### Prismaクライアントの再生成

スキーマを変更した後：

```bash
# Prismaクライアントを再生成
npx prisma generate

# データベースにスキーマ変更を反映
npx prisma db push
```

### データベースの確認

```bash
# Prisma Studioでデータベースの内容を確認
npx prisma studio
```

## 📁 プロジェクト構成

```
src/
├── lib/
│   ├── server/
│   │   └── auth.ts         # 認証ユーティリティ
│   └── components/         # UIコンポーネント
├── routes/
│   ├── +layout.svelte      # 全体レイアウト
│   ├── +page.svelte        # ホームページ
│   ├── (auth)/
│   │   ├── login/          # ログインページ
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   ├── register/       # 登録ページ
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   └── logout/         # ログアウト処理
│   │       └── +server.ts
│   └── (protected)/        # 認証が必要なページ
│       ├── +layout.server.ts
│       ├── dashboard/      # ダッシュボード
│       └── profile/        # プロフィール
├── app.d.ts               # 型定義
└── hooks.server.ts        # サーバーフック
```

## 🔐 実装機能

### 基本機能
- ✅ ユーザー登録
- ✅ ログイン/ログアウト
- ✅ セッション管理
- 🚧 パスワードリセット
- 🚧 メール認証

### セキュリティ
- ✅ パスワードハッシュ化 (bcrypt)
- ✅ HTTPOnly Cookie
- ✅ CSRF対策 (SvelteKit標準)
- ✅ セッション有効期限
- 🚧 レート制限

### UI/UX
- ✅ フォームバリデーション
- ✅ エラーメッセージ表示
- ✅ ローディング状態
- ✅ ダークモード対応
- ✅ autocomplete属性
- 🚧 Remember Me機能
- 🚧 ソーシャルログイン

## 🗄 データベーススキーマ

```prisma
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
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

## 🚀 デプロイ

### Vercel (推奨)

```bash
# Vercel CLIのインストール
npm i -g vercel

# デプロイ
vercel

# 環境変数の設定
# VercelダッシュボードでDATABASE_URLとJWT_SECRETを設定
```

### その他のプラットフォーム

- **Netlify**: `@sveltejs/adapter-netlify`を使用
- **Node.js**: `@sveltejs/adapter-node`を使用
- **Docker**: Dockerfileを追加して対応

## 📝 環境変数

```env
# .env.example
DATABASE_URL="file:./dev.db"  # SQLiteの場合
# DATABASE_URL="postgresql://..."  # PostgreSQLの場合
JWT_SECRET="your-super-secret-key-change-in-production"
```

## 🧪 テスト

```bash
# ユニットテスト
npm run test:unit

# E2Eテスト
npm run test:e2e

# すべてのテスト
npm test
```

## 🚀 デプロイ

### Vercel（推奨）

このプロジェクトはVercelにデプロイ可能です。詳細は[Vercelデプロイメントガイド](./docs/VERCEL_DEPLOYMENT.md)を参照してください。

```bash
# Vercel CLIでデプロイ
vercel

# 環境変数を設定（Vercelダッシュボードで）
# Neonを使用する場合
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Vercel Postgresを使用する場合
DATABASE_URL=<Vercel PostgresのPOSTGRES_PRISMA_URL>

# 共通
JWT_SECRET=<ランダムな文字列>
```

**注意**: 本番環境ではPostgreSQLが必要です（Neon、Vercel Postgres、Supabaseなど）

### GitHub Pages について

GitHub Pagesは静的ホスティングサービスのため、**サーバーサイド機能（Form Actions、データベース接続など）は動作しません。**

### 動作する機能
- ✅ ページの表示とナビゲーション
- ✅ クライアントサイドのバリデーション
- ✅ UIコンポーネント
- ✅ ダークモード

### 動作しない機能
- ❌ ユーザー登録・ログイン（Form Actions）
- ❌ データベース操作
- ❌ セッション管理
- ❌ サーバーサイドレンダリング

### 完全な機能を試すには

以下のいずれかの方法で動作確認してください：

1. **ローカル環境で実行**
   ```bash
   npm run dev
   ```

2. **サーバー環境にデプロイ**
   - Vercel、Netlify、Railway などのNode.js対応ホスティング
   - VPSやクラウドサーバー

## 📚 学習リソース

- [Svelte 5 ドキュメント](https://svelte.dev/docs)
- [SvelteKit ドキュメント](https://kit.svelte.dev/docs)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [実装解説記事](https://shuji-bonji.github.io/Svelte-and-SvelteKit-with-TypeScript/examples/auth-basic/)

## 🤝 コントリビューション

プルリクエストは歓迎です！大きな変更の場合は、まずissueを開いて変更内容について議論してください。

## 📄 ライセンス

MIT

## 👤 作者

- GitHub: [@shuji-bonji](https://github.com/shuji-bonji)

## 🙏 謝辞

このプロジェクトは、Svelte/SvelteKitコミュニティの多くの素晴らしいリソースとサンプルから学んで作成されました。

---

**注意**: これは学習用のサンプル実装です。本番環境で使用する場合は、追加のセキュリティ対策（レート制限、2FA、監査ログなど）を実装してください。