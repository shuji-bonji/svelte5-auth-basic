<footer class="footer">
  <div class="footer-content">
    <p>&copy; 2025 Auth Basic Demo. Built with Svelte 5 and SvelteKit.</p>
    <div class="links">
      <a href="https://github.com/shuji-bonji/svelte5-auth-basic" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer">
        Svelte
      </a>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border);
    margin-top: auto;
    padding: 2rem 0;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }
  
  .footer-content p {
    margin: 0 0 1rem;
    color: var(--color-text-secondary);
  }
  
  .links {
    display: flex;
    gap: 2rem;
    justify-content: center;
  }
  
  .links a {
    color: var(--color-primary);
    text-decoration: none;
  }
  
  .links a:hover {
    text-decoration: underline;
  }
</style>