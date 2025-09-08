<script lang="ts">
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  
  // ユーザー情報を親レイアウトから受け取る
  let { user }: { user?: { id: string; email: string; name: string | null } } = $props();
  
  let currentPath = $derived($page.url.pathname);
  
  function isActive(path: string): boolean {
    const current = currentPath.replace(base, '') || '/';
    if (path === '/' && current === '/') {
      return true;
    }
    if (path !== '/' && current.startsWith(path)) {
      return true;
    }
    return false;
  }
</script>

<nav class="navbar">
  <div class="nav-container">
    <a href="{base}/" class="logo">🔐 Auth Basic</a>
    <ul class="nav-menu">
      <li>
        <a 
          href="{base}/"
          class:active={isActive('/')}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          ホーム
        </a>
      </li>
      {#if user}
        <li>
          <a 
            href="{base}/dashboard"
            class:active={isActive('/dashboard')}
            aria-current={isActive('/dashboard') ? 'page' : undefined}
          >
            ダッシュボード
          </a>
        </li>
        <li class="user-info">
          <span>{user.name || user.email}</span>
        </li>
        <li>
          <form method="POST" action="/logout" class="logout-form">
            <button type="submit" class="logout-btn">ログアウト</button>
          </form>
        </li>
      {:else}
        <li>
          <a 
            href="{base}/login"
            class:active={isActive('/login')}
            aria-current={isActive('/login') ? 'page' : undefined}
          >
            ログイン
          </a>
        </li>
        <li>
          <a 
            href="{base}/register"
            class:active={isActive('/register')}
            aria-current={isActive('/register') ? 'page' : undefined}
            class="register-btn"
          >
            新規登録
          </a>
        </li>
      {/if}
    </ul>
  </div>
</nav>

<style>
  .navbar {
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: var(--color-text);
  }
  
  .nav-menu {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
  }
  
  .nav-menu a {
    text-decoration: none;
    color: var(--color-text-secondary);
    transition: color 0.2s;
  }
  
  .nav-menu a:hover,
  .nav-menu a.active {
    color: var(--color-primary);
  }
  
  .register-btn {
    background: var(--color-primary);
    color: white !important;
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }
  
  .register-btn:hover {
    background: var(--color-primary-dark);
  }
  
  .user-info {
    color: var(--color-text);
    font-weight: 500;
  }
  
  .logout-form {
    margin: 0;
  }
  
  .logout-btn {
    background: none;
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }
  
  .logout-btn:hover {
    background: var(--color-bg);
    color: var(--color-text);
  }
  
  @media (max-width: 768px) {
    .nav-menu {
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    
    .nav-container {
      padding: 1rem;
    }
    
    .logo {
      font-size: 1.25rem;
    }
    
    .user-info span {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
  }
</style>