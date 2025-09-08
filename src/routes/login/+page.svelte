<script lang="ts">
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  
  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>ログイン - Svelte 5 Auth Basic</title>
</svelte:head>

<div class="auth-container">
  <div class="auth-card">
    <h1>ログイン</h1>
    
    {#if form?.error}
      <div class="error-message">
        {form.error}
      </div>
    {/if}
    
    <form method="POST" use:enhance>
      <div class="form-group">
        <label for="email">メールアドレス</label>
        <input
          type="email"
          id="email"
          name="email"
          autocomplete="email"
          required
          value={form?.email ?? ''}
        />
      </div>
      
      <div class="form-group">
        <label for="password">パスワード</label>
        <input
          type="password"
          id="password"
          name="password"
          autocomplete="current-password"
          required
        />
      </div>
      
      <button type="submit" class="btn btn-primary">
        ログイン
      </button>
    </form>
    
    <p class="auth-link">
      アカウントをお持ちでない方は <a href="/register">新規登録</a>
    </p>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 200px);
    padding: 2rem;
  }
  
  .auth-card {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    margin: 0 0 1.5rem;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 1rem;
    background: var(--color-bg);
    color: var(--color-text);
  }
  
  input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background: var(--color-primary);
    color: white;
  }
  
  .btn-primary:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
  }
  
  .auth-link {
    text-align: center;
    margin-top: 1.5rem;
    color: var(--color-text-secondary);
  }
  
  .auth-link a {
    color: var(--color-primary);
    text-decoration: none;
  }
  
  .auth-link a:hover {
    text-decoration: underline;
  }
  
  .error-message {
    background: #fee;
    color: #c00;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }
</style>