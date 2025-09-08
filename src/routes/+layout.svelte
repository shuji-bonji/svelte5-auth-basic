<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import type { Snippet } from 'svelte';
  import '../app.css';
  
  let { children }: { children?: Snippet } = $props();
</script>

<div class="app">
  <Navigation />
  
  <main class="main">
    {@render children?.()}
  </main>
  
  <Footer />
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
  }
  
  @media (max-width: 768px) {
    .main {
      padding: 1rem;
    }
  }
</style>