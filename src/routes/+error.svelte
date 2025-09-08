<script lang="ts">
  import { page } from '$app/stores';
  import { base } from '$app/paths';
</script>

<div class="error-page">
  <h1>{$page.status}</h1>
  <p>{$page.error?.message || 'エラーが発生しました'}</p>
  <a href="{base}/" class="home-link">ホームへ戻る</a>
</div>

<style>
  .error-page {
    text-align: center;
    padding: 4rem 0;
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  h1 {
    font-size: 4rem;
    margin: 0;
    color: var(--color-primary);
  }
  
  p {
    color: var(--color-text-secondary);
    margin: 1rem 0 2rem;
    font-size: 1.25rem;
  }
  
  .home-link {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: transform 0.2s;
  }
  
  .home-link:hover {
    transform: translateY(-2px);
  }
</style>