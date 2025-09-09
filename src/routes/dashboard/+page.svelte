<script lang="ts">
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>ダッシュボード - Svelte 5 Auth Basic</title>
</svelte:head>

<div class="dashboard">
  <div class="welcome-section">
    <h1>ダッシュボード</h1>
    <p class="welcome-message">
      ようこそ、{data.user?.name || data.user?.email}さん！
    </p>
  </div>
  
  <div class="dashboard-grid">
    <div class="dashboard-card">
      <h2>👤 プロフィール情報</h2>
      <div class="info-list">
        <div class="info-item">
          <span class="label">名前:</span>
          <span class="value">{data.user?.name || '未設定'}</span>
        </div>
        <div class="info-item">
          <span class="label">メールアドレス:</span>
          <span class="value">{data.user?.email}</span>
        </div>
        <div class="info-item">
          <span class="label">ユーザーID:</span>
          <span class="value">{data.user?.id}</span>
        </div>
      </div>
      <button type="button" class="btn btn-secondary" disabled>プロフィール編集（準備中）</button>
    </div>
    
    <div class="dashboard-card">
      <h2>🔐 セキュリティ</h2>
      <p>アカウントのセキュリティ設定を管理します。</p>
      <ul class="feature-list">
        <li>✅ パスワード保護</li>
        <li>✅ セッション管理</li>
        <li>🚧 2要素認証（準備中）</li>
        <li>🚧 ログイン履歴（準備中）</li>
      </ul>
    </div>
    
    <div class="dashboard-card">
      <h2>📊 アクティビティ</h2>
      <p>最近のアクティビティと統計情報</p>
      <div class="stats">
        <div class="stat">
          <span class="stat-value">1</span>
          <span class="stat-label">ログイン回数</span>
        </div>
        <div class="stat">
          <span class="stat-value">今</span>
          <span class="stat-label">最終ログイン</span>
        </div>
      </div>
    </div>
    
    <div class="dashboard-card">
      <h2>⚙️ 設定</h2>
      <p>アプリケーションの設定を変更します。</p>
      <div class="settings-links">
        <button type="button" class="link-button" disabled>アカウント設定（準備中）</button>
        <button type="button" class="link-button" disabled>プライバシー設定（準備中）</button>
        <button type="button" class="link-button" disabled>通知設定（準備中）</button>
      </div>
    </div>
  </div>
  
  <div class="logout-section">
    <form method="POST" action="/logout">
      <button type="submit" class="btn btn-danger">
        ログアウト
      </button>
    </form>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .welcome-section {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .welcome-section h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .welcome-message {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
  }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .dashboard-card {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--color-border);
  }
  
  .dashboard-card h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }
  
  .info-list {
    margin: 1rem 0;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }
  
  .info-item:last-child {
    border-bottom: none;
  }
  
  .label {
    font-weight: 500;
    color: var(--color-text-secondary);
  }
  
  .value {
    color: var(--color-text);
    word-break: break-all;
  }
  
  .feature-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }
  
  .feature-list li {
    padding: 0.5rem 0;
  }
  
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-primary);
  }
  
  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-top: 0.25rem;
  }
  
  .settings-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .settings-links button.link-button {
    background: none;
    border: none;
    color: var(--color-primary);
    text-decoration: none;
    padding: 0.5rem 0;
    text-align: left;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    width: 100%;
  }
  
  .settings-links button.link-button:hover {
    text-decoration: underline;
  }
  
  .settings-links button.link-button[disabled] {
    color: var(--color-text-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .settings-links button.link-button[disabled]:hover {
    text-decoration: none;
  }
  
  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    margin-top: 1rem;
  }
  
  .btn-secondary {
    background: var(--color-bg);
    color: var(--color-text);
    border: 2px solid var(--color-border);
  }
  
  .btn-secondary:hover {
    background: var(--color-bg-secondary);
  }
  
  .btn-secondary[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-secondary[disabled]:hover {
    background: var(--color-bg);
  }
  
  .btn-danger {
    background: #dc3545;
    color: white;
  }
  
  .btn-danger:hover {
    background: #c82333;
  }
  
  .logout-section {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
  }
  
  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
</style>