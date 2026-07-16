<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import Router, { push, location } from 'svelte-spa-router';
  import { routes } from '@/routes';
  import AppShell from '@/components/AppShell.svelte';
  import ToastHost from '@/components/ToastHost.svelte';
  import { authLoading, initAuth } from '@/lib/auth';

  const RETURN_TO_KEY = 'auth-return-to';

  onMount(() => {
    let unsubscribe: (() => void) | undefined;
    initAuth().then((cleanup) => {
      unsubscribe = cleanup;
    });
    return () => unsubscribe?.();
  });

  function handleConditionsFailed(
    event: CustomEvent<{ userData?: { redirect?: string; saveReturnTo?: boolean } }>,
  ) {
    const detail = event.detail?.userData;
    const redirect = detail?.redirect;
    if (!redirect) return;

    if (detail?.saveReturnTo && redirect === '/login') {
      const path = get(location) || '/';
      sessionStorage.setItem(RETURN_TO_KEY, path);
    }

    push(redirect);
  }
</script>

<ToastHost />

{#if $authLoading}
  <div class="flex h-screen items-center justify-center">
    <div
      class="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
      role="status"
      aria-label="Loading"
    ></div>
  </div>
{:else}
  <AppShell>
    <Router {routes} on:conditionsFailed={handleConditionsFailed} />
  </AppShell>
{/if}
