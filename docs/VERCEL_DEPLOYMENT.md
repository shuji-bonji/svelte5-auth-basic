# Vercelへのデプロイガイド

## 現在の状況

現時点でVercelにデプロイすると、以下の設定が必要です：

## 必要な設定

### 1. データベースの設定（Neon使用の場合）

#### Neonデータベースの作成
1. [Neon Console](https://console.neon.tech)にアクセス
2. 新しいプロジェクトを作成
3. 接続文字列を取得（`postgresql://...`形式）

#### Vercel Postgresを使用する場合
1. Vercelダッシュボードで「Storage」タブを開く
2. 「Create Database」をクリック
3. 「Postgres」を選択
4. データベースを作成

### 2. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

```
# Neonを使用する場合
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Vercel Postgresを使用する場合
DATABASE_URL=<Vercel PostgresのPOSTGRES_PRISMA_URL>

# 共通
JWT_SECRET=<ランダムな文字列（32文字以上推奨）>
```

**重要**: 
- Neonの場合: 接続文字列に`?sslmode=require`を必ず含める
- Vercel Postgresの場合: `POSTGRES_PRISMA_URL`を使用（`POSTGRES_URL`ではなく）

### 3. データベースの初期化

#### 方法A: ローカルから初期化（推奨）
```bash
# 環境変数を設定してスキーマを適用
DATABASE_URL="<NeonまたはVercel PostgresのURL>" npx prisma db push --schema=./prisma/schema.production.prisma
```

#### 方法B: Vercelのビルド時に自動初期化
**注意**: この方法はビルド時間が長くなる可能性があります

`package.json`のビルドスクリプトを以下のように変更：
```json
"build": "prisma generate --schema=./prisma/schema.production.prisma && prisma db push --schema=./prisma/schema.production.prisma && vite build"
```

### 4. デプロイ手順

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# プロジェクトをVercelにリンク
vercel link

# デプロイ
vercel --prod
```

### 5. 継続的デプロイ（GitHub連携）

1. GitHubリポジトリをVercelに接続
2. 環境変数をVercelダッシュボードで設定
3. `main`ブランチへのpush時に自動デプロイ

**重要**: データベーススキーマの変更がある場合は、デプロイ前に手動でスキーマを更新することを推奨：
```bash
DATABASE_URL="<本番DB URL>" npx prisma db push --schema=./prisma/schema.production.prisma
```

## 本番用スキーマについて

本番環境では`prisma/schema.production.prisma`が使用されます：
- プロバイダー: PostgreSQL
- ローカル開発: SQLite（`prisma/schema.prisma`）
- 本番環境: PostgreSQL（`prisma/schema.production.prisma`）

## ビルドプロセス

Vercelでのビルド時：
1. `npm install`が実行される
2. `postinstall`スクリプトでPrismaクライアントが生成される（PostgreSQL用）
3. `npm run build`でアプリケーションがビルドされる

## トラブルシューティング

### エラー: "the URL must start with the protocol `postgresql://`"

**原因**: DATABASE_URLが正しく設定されていない

**解決方法**: 
- Vercel Postgresの`POSTGRES_PRISMA_URL`を`DATABASE_URL`として設定する
- URLが`postgresql://`または`postgres://`で始まることを確認

### エラー: "P1001: Can't reach database server"

**原因**: データベースへの接続ができない

**解決方法**:
- Vercel Postgresが正しく作成されているか確認
- 環境変数が正しく設定されているか確認

### エラー: "relation does not exist"

**原因**: データベーステーブルが作成されていない

**解決方法**:
```bash
# Neonの場合
DATABASE_URL="postgresql://..." npx prisma db push --schema=./prisma/schema.production.prisma

# Vercel Postgresの場合
DATABASE_URL="<Vercel PostgresのURL>" npx prisma db push --schema=./prisma/schema.production.prisma
```

### Neon特有の注意事項

1. **接続プーリング**: Neonは接続プーリングをサポート。大量の同時接続がある場合は、pooled connectionを使用
2. **コールドスタート**: 無料プランでは一定時間アクセスがないとデータベースがスリープ状態になる
3. **リージョン**: データベースのリージョンをVercelのデプロイリージョンに近い場所に設定すると、レイテンシが改善される

## ローカルテスト

本番環境の設定をローカルでテストする場合：

```bash
# PostgreSQL用のPrismaクライアントを生成
npx prisma generate --schema=./prisma/schema.production.prisma

# ローカルでPostgreSQLを使用してテスト
DATABASE_URL="postgresql://..." npm run build:local
DATABASE_URL="postgresql://..." npm run preview
```

## 本番データベースの管理

### .env.localを使用した管理（推奨）

Vercel CLIを使用している場合、`.env.local`にデータベースURLが自動的に保存されます。

### 利用可能なnpmスクリプト

```bash
# スキーマを本番DBに適用（データ保持）
npm run db:push:prod

# 本番DBを初期化（⚠️ 全データ削除）
npm run db:reset:prod

# 本番DBをブラウザで確認（Prisma Studio）
npm run db:studio:prod

# スキーマ更新してデプロイ
npm run deploy:prod
```

### 本番DBの初期化手順

#### 初回セットアップ
```bash
# 1. Vercelで環境変数設定（DATABASE_URL, JWT_SECRET）
# 2. 本番DBにスキーマを適用
npm run db:push:prod
```

#### データベースの完全リセット

⚠️ **警告**: 以下の操作は全てのデータを削除します！

```bash
# 方法1: npmスクリプトを使用（推奨）
npm run db:reset:prod

# 方法2: 手動で実行
DATABASE_URL="<NeonのURL>" npx prisma db push --schema=./prisma/schema.production.prisma --force-reset
```

### スキーマ変更の反映

```bash
# 1. ローカルスキーマを編集
# prisma/schema.prisma を編集

# 2. 本番用スキーマも編集
# prisma/schema.production.prisma を同じように編集

# 3. ローカルDBに適用（開発確認用）
npm run db:push

# 4. 本番DBに適用
npm run db:push:prod

# 5. デプロイ
git add .
git commit -m "スキーマ更新"
git push origin main
```

### ショートカット（スキーマ更新 + デプロイ）

```bash
# 本番DBに反映してGitHubにpush（Vercel自動デプロイ）
npm run deploy:prod
```

### データベースの確認

```bash
# 本番DBの内容をPrisma Studioで確認
npm run db:studio:prod

# Neon Consoleでも確認可能
# https://console.neon.tech
```

## セキュリティに関する注意事項

- `.env.local`ファイルは**絶対にGitにコミットしない**（.gitignoreに追加済み）
- 本番DBのURLは開発者のみがアクセスできるように管理
- `db:reset:prod`は本番環境では慎重に使用
- 定期的なバックアップを推奨

## 注意事項

- SQLiteとPostgreSQLで若干の動作の違いがある可能性があります
- 本番環境では必ず強力な`JWT_SECRET`を使用してください
- Vercel Postgresには無料枠の制限があります（詳細はVercelのドキュメントを参照）
- Neonの無料プランはコールドスタートがあるため、初回アクセスが遅い場合があります