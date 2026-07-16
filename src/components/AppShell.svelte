<script lang="ts">
  import type { Snippet } from 'svelte';
  import { location } from 'svelte-spa-router';
  import AppHeader from '@/components/AppHeader.svelte';

  let { children }: { children: Snippet } = $props();

  const chatFullBleed = $derived($location === '/chat');
</script>

<div class="flex min-h-screen flex-col bg-slate-50">
  <AppHeader />
  <main
    class="mx-auto w-full flex-1 {chatFullBleed ? 'max-w-none p-0' : 'max-w-5xl p-4'}"
  >
    {@render children()}
  </main>
</div>
