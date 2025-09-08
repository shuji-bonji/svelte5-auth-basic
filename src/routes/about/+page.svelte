<svelte:head>
  <title>About - My Blog</title>
  <meta name="description" content="Svelte 5とSvelteKitで構築されたブログシステムについて">
</svelte:head>

<div class="about">
  <h1>About This Blog</h1>
  
  <section class="content">
    <p>
      このブログは、Svelte 5とSvelteKitを使用して構築されたデモンストレーションサイトです。
      最新のWeb技術を活用し、高速で使いやすいブログシステムを実現しています。
    </p>
    
    <h2>使用技術</h2>
    <ul>
      <li><strong>Svelte 5</strong> - Runesシステムによる効率的なリアクティビティ</li>
      <li><strong>SvelteKit</strong> - フルスタックWebアプリケーションフレームワーク</li>
      <li><strong>TypeScript</strong> - 型安全な開発環境</li>
      <li><strong>Static Site Generation</strong> - 高速なページ配信</li>
    </ul>
    
    <h2>特徴</h2>
    <ul>
      <li>ファイルベースルーティング</li>
      <li>動的ルートによる記事ページ生成</li>
      <li>レスポンシブデザイン</li>
      <li>ダークモード対応</li>
      <li>SEO最適化</li>
    </ul>
    
    <h2>ソースコード</h2>
    <p>
      このプロジェクトのソースコードは、
      <a href="https://github.com/shuji-bonji/svelte5-blog-example" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      で公開されています。
    </p>
  </section>
</div>

<style>
  .about {
    max-width: 800px;
    margin: 0 auto;
  }
  
  h1 {
    margin-bottom: 2rem;
  }
  
  .content {
    line-height: 1.8;
  }
  
  .content h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }
  
  .content ul {
    margin: 1rem 0;
    padding-left: 2rem;
  }
  
  .content li {
    margin: 0.5rem 0;
  }
  
  .content a {
    color: var(--color-primary);
    text-decoration: none;
  }
  
  .content a:hover {
    text-decoration: underline;
  }
</style>