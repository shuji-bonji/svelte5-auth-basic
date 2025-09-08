<script lang="ts">
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  
  type NavItem = {
    href: string;
    label: string;
    matchPath?: string;
  };
  
  const navItems: NavItem[] = [
    { href: '/', label: 'ホーム' },
    { href: '/blog', label: 'ブログ', matchPath: '/blog' },
    { href: '/about', label: 'About' }
  ];
  
  let currentPath = $derived($page.url.pathname);
  
  function isActive(item: NavItem): boolean {
    const path = currentPath.replace(base, '') || '/';
    if (item.href === '/' && path === '/') {
      return true;
    }
    if (item.href !== '/' && path.startsWith(item.matchPath || item.href)) {
      return true;
    }
    return false;
  }
</script>

<nav class="navbar">
  <div class="nav-container">
    <a href="{base}/" class="logo">My Blog</a>
    <ul class="nav-menu">
      {#each navItems as item}
        <li>
          <a 
            href="{base}{item.href}"
            class:active={isActive(item)}
            aria-current={isActive(item) ? 'page' : undefined}
          >
            {item.label}
          </a>
        </li>
      {/each}
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
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
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
  
  @media (max-width: 768px) {
    .nav-menu {
      gap: 1rem;
    }
    
    .nav-container {
      padding: 1rem;
    }
  }
</style>