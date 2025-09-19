<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Svelte 5 Auth Basic - 認証システム実装例</title>
  <meta name="description" content="Svelte 5とSvelteKitで構築された、Cookie/Session認証システムの実装例">
</svelte:head>

<div class="home">
  <section class="hero">
    <h1>Svelte 5 Auth Basic</h1>
    <p>Cookie/Sessionベースの認証システム実装例</p>
  </section>
  
  <section class="features">
    <h2>機能</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <h3>🔐 ユーザー登録</h3>
        <p>メールアドレスとパスワードで新規アカウント作成</p>
      </div>
      <div class="feature-card">
        <h3>🔑 ログイン/ログアウト</h3>
        <p>セキュアなセッション管理</p>
      </div>
      <div class="feature-card">
        <h3>🛡️ 保護されたページ</h3>
        <p>認証が必要なページへのアクセス制御</p>
      </div>
      <div class="feature-card">
        <h3>👤 プロフィール管理</h3>
        <p>ユーザー情報の表示と編集</p>
      </div>
    </div>
  </section>
  
  <section class="cta">
    <h2>始めましょう</h2>
    <div class="cta-buttons">
      <a href={resolve('/register')} class="btn btn-primary">新規登録</a>
      <a href={resolve('/login')} class="btn btn-secondary">ログイン</a>
    </div>
  </section>
</div>

<style>
  .hero {
    text-align: center;
    padding: 4rem 0;
  }
  
  .hero h1 {
    font-size: 3rem;
    margin: 0 0 1rem;
    background: linear-gradient(135deg, var(--color-primary), #ff6b42);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero p {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
  }
  
  .features {
    margin-top: 4rem;
  }
  
  .features h2 {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
  }
  
  .feature-card {
    padding: 1.5rem;
    background: var(--color-bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }
  
  .feature-card h3 {
    margin: 0 0 0.5rem;
  }
  
  .feature-card p {
    color: var(--color-text-secondary);
  }
  
  .cta {
    text-align: center;
    margin-top: 4rem;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: transform 0.2s;
  }
  
  .btn:hover {
    transform: translateY(-2px);
  }
  
  .btn-primary {
    background: var(--color-primary);
    color: white;
  }
  
  .btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 2px solid var(--color-border);
  }
  
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2rem;
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .btn {
      width: 200px;
    }
  }
</style>