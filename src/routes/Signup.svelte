<script lang="ts">
  import { link, push } from 'svelte-spa-router';
  import { authLoading, signUp, loginWithGoogle } from '@/lib/auth';
  import { toastError, toastSuccess } from '@/lib/toast';

  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let isSubmitting = $state(false);
  let isGoogleLoading = $state(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toastError("Passwords don't match");
      return;
    }

    isSubmitting = true;
    try {
      const { error } = await signUp(email, password);
      if (error) {
        toastError(error.message || 'Failed to create account');
      } else {
        toastSuccess('Account created successfully');
        push('/');
      }
    } catch {
      toastError('An unexpected error occurred');
    } finally {
      isSubmitting = false;
    }
  }

  async function handleGoogleSignUp() {
    isGoogleLoading = true;
    try {
      const { error } = await loginWithGoogle();
      if (error) {
        toastError(error.message || 'Failed to sign up with Google');
      }
    } catch {
      toastError('An unexpected error occurred with Google sign up');
    } finally {
      isGoogleLoading = false;
    }
  }
</script>

<div class="flex flex-col items-center justify-center py-8">
  <div class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-slate-900">Create account</h1>
      <p class="text-balance text-slate-600">Create your account to continue</p>
    </div>

    <button
      type="button"
      class="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
      disabled={$authLoading || isSubmitting || isGoogleLoading}
      onclick={handleGoogleSignUp}
    >
      {#if isGoogleLoading}
        <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></span>
        Loading…
      {:else}
        Sign up with Google
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
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          bind:value={email}
          required
          disabled={$authLoading || isSubmitting}
        />
      </div>
      <div>
        <label for="password" class="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <input
          id="password"
          type="password"
          autocomplete="new-password"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          bind:value={password}
          required
          disabled={$authLoading || isSubmitting}
        />
      </div>
      <div>
        <label for="confirmPassword" class="mb-1 block text-sm font-medium text-slate-700"
          >Confirm password</label
        >
        <input
          id="confirmPassword"
          type="password"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          bind:value={confirmPassword}
          required
          disabled={$authLoading || isSubmitting}
        />
      </div>
      <button
        type="submit"
        class="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        disabled={$authLoading || isSubmitting}
      >
        {isSubmitting ? 'Loading…' : 'Register'}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      Already have an account?
      <a href="/login" use:link class="font-medium text-slate-900 underline">Login</a>
    </p>
  </div>
</div>
