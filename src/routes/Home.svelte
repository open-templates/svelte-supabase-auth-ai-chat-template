<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '@/lib/auth';
  import { fetchMe, type MeResponse } from '@/lib/me';

  let profile = $state<MeResponse | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(() => {
    let cancelled = false;

    const load = async () => {
      loading = true;
      error = null;
      const { data, error: apiError } = await fetchMe();
      if (cancelled) return;
      if (apiError || !data) {
        error = apiError ?? 'Failed to load profile';
        profile = null;
      } else {
        profile = data;
      }
      loading = false;
    };

    load();
    return () => {
      cancelled = true;
    };
  });
</script>

<div class="flex flex-col gap-6 py-8">
  <div>
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Welcome</h1>
    <p class="mt-1 text-slate-600">
      You are signed in. This page calls the protected
      <code class="rounded bg-slate-100 px-1 text-sm">GET /me</code> API on your Cloudflare
      Worker backend.
    </p>
  </div>

  <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-100 px-6 py-4">
      <h2 class="text-lg font-semibold">Session (Supabase client)</h2>
      <p class="text-sm text-slate-500">From the browser Supabase auth session.</p>
    </div>
    <div class="space-y-1 px-6 py-4 text-sm">
      <p>
        <span class="text-slate-500">Email:</span>
        {$user?.email}
      </p>
      <p>
        <span class="text-slate-500">User ID:</span>
        {$user?.id}
      </p>
    </div>
  </section>

  <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-100 px-6 py-4">
      <h2 class="text-lg font-semibold">Profile (API /me)</h2>
      <p class="text-sm text-slate-500">
        Returned by cf-hono-supabase-gemini-api-template using your JWT.
      </p>
    </div>
    <div class="px-6 py-4">
      {#if loading}
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
          ></div>
          Loading profile…
        </div>
      {:else if error}
        <p class="text-sm text-red-600">{error}</p>
      {:else}
        <pre class="overflow-x-auto rounded-md bg-slate-100 p-4 text-xs">{JSON.stringify(
            profile,
            null,
            2,
          )}</pre>
      {/if}
    </div>
  </section>
</div>
