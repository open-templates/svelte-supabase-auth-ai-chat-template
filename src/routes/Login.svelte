<script lang="ts">
  import { link, push } from 'svelte-spa-router';
  import { authLoading, signIn, loginWithGoogle } from '@/lib/auth';
  import { toastError } from '@/lib/toast';

  const RETURN_TO_KEY = 'auth-return-to';

  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let isGoogleLoading = $state(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    isSubmitting = true;
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toastError(error.message || 'Failed to sign in');
      } else {
        const returnTo = sessionStorage.getItem(RETURN_TO_KEY) || '/';
        sessionStorage.removeItem(RETURN_TO_KEY);
        push(returnTo);
      }
    } catch {
      toastError('An unexpected error occurred');
    } finally {
      isSubmitting = false;
    }
  }

  async function handleGoogleLogin() {
    isGoogleLoading = true;
    try {
      const { error } = await loginWithGoogle();
      if (error) {
        toastError(error.message || 'Failed to sign in with Google');
      }
    } catch {
      toastError('An unexpected error occurred with Google login');
    } finally {
      isGoogleLoading = false;
    }
  }
</script>

<div class="flex flex-col items-center justify-center py-8">
  <div class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-slate-900">Welcome back</h1>
      <p class="text-balance text-slate-600">Login to your account to continue</p>
    </div>

    <button
      type="button"
      class="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
      disabled={$authLoading || isSubmitting || isGoogleLoading}
      onclick={handleGoogleLogin}
    >
      {#if isGoogleLoading}
        <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></span>
        Loading…
      {:else}
        Login with Google
      {/if}
    </button>

    <div class="relative my-6 text-center text-xs uppercase tracking-wide text-slate-400">
      <span class="bg-white px-2">Or continue with email</span>
      <div class="absolute inset-x-0 top-1/2 -z-10 border-t border-slate-200"></div>
    </div>

    <form class="flex flex-col gap-4" onsubmit={handleSubmit}>
      <div>
        <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input
          id="email"
          type="email"
          autocomplete="email"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          bind:value={email}
          required
          disabled={$authLoading || isSubmitting}
        />
      </div>
      <div>
        <div class="mb-1 flex items-center justify-between">
          <label for="password" class="text-sm font-medium text-slate-700">Password</label>
          <a href="/recover-password" use:link class="text-sm text-slate-600 hover:underline"
            >Forgot password</a
          >
        </div>
        <input
          id="password"
          type="password"
          autocomplete="current-password"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          bind:value={password}
          required
          disabled={$authLoading || isSubmitting}
        />
      </div>
      <button
        type="submit"
        class="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        disabled={$authLoading || isSubmitting}
      >
        {isSubmitting ? 'Loading…' : 'Login'}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      Don't have an account?
      <a href="/signup" use:link class="font-medium text-slate-900 underline">Sign up</a>
    </p>
  </div>
</div>
