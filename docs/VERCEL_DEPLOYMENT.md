# Vercelデプロイメントガイド

## 🚀 デプロイ手順

### 1. Vercel CLIのインストール
```bash
npm i -g vercel
```

### 2. Vercel Postgresのセットアップ

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクトを選択
3. "Storage" タブから "Create Database"
4. "Postgres" を選択
5. データベース名を入力して作成

### 3. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

```
DATABASE_URL=<Vercel Postgresの接続URL>
SESSION_SECRET=<ランダムな文字列>
```

### 4. Prismaスキーマの適用

PostgreSQL用のスキーマに切り替え：

```bash
# PostgreSQL用スキーマを使用
cp prisma/schema.postgres.prisma prisma/schema.prisma

# データベースにスキーマを適用
npx prisma db push
```

### 5. デプロイ

```bash
# 初回デプロイ
vercel

# 以降のデプロイ
vercel --prod
```

## 📝 ローカル開発とVercelの切り替え

### ローカル開発（SQLite）
```bash
# SQLiteスキーマを使用
cp prisma/schema.sqlite.prisma prisma/schema.prisma

# .envファイルでSQLiteを指定
DATABASE_URL="file:./dev.db"
```

### Vercel（PostgreSQL）
```bash
# PostgreSQLスキーマを使用
cp prisma/schema.postgres.prisma prisma/schema.prisma

# .envファイルでPostgreSQLを指定
DATABASE_URL="postgresql://..."
```

## 🔄 データベースのリセット

### 開発環境（SQLite）
```bash
# データベースファイルを削除
rm prisma/dev.db

# 新しいデータベースを作成
npx prisma db push
```

### 本番環境（Vercel Postgres）
```bash
# Vercelダッシュボードから：
# 1. Storage → データベース選択
# 2. Settings → Reset Database

# または、Prismaでリセット
npx prisma db push --force-reset
```

## ⚠️ 注意事項

1. **環境変数**: 本番環境では必ず`SESSION_SECRET`を変更してください
2. **データベース**: ローカルとVercelで異なるデータベースを使用します
3. **マイグレーション**: 本番環境では`prisma migrate deploy`を使用することを推奨

## 🛠 トラブルシューティング

### ビルドエラー
```bash
# Prismaクライアントを再生成
npx prisma generate
```

### データベース接続エラー
- Vercelダッシュボードで環境変数が正しく設定されているか確認
- データベースのリージョンとデプロイリージョンが一致しているか確認

### セッションエラー
- `SESSION_SECRET`が設定されているか確認
- Cookieの設定（SameSite、Secure）を確認