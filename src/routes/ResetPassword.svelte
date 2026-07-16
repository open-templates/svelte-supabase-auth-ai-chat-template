<script lang="ts">
  import { push } from 'svelte-spa-router';
  import { authLoading, updatePassword, signOut } from '@/lib/auth';
  import { toastError, toastSuccess } from '@/lib/toast';

  let password = $state('');
  let confirmPassword = $state('');
  let isSubmitting = $state(false);
  let passwordUpdated = $state(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toastError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toastError('Password must be at least 6 characters long');
      return;
    }

    isSubmitting = true;
    try {
      const { error } = await updatePassword(password);
      if (error) {
        toastError(error.message || 'Failed to update password');
      } else {
        toastSuccess('Password updated successfully');
        passwordUpdated = true;
        setTimeout(async () => {
          try {
            await signOut();
          } catch {
            push('/login');
          }
        }, 2000);
      }
    } catch {
      toastError('An unexpected error occurred');
    } finally {
      isSubmitting = false;
    }
  }

  async function handleBackToLogin() {
    try {
      await signOut();
    } catch {
      push('/login');
    }
  }
</script>

<div class="flex flex-col items-center justify-center py-8">
  <div class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-slate-900">Reset password</h1>
      <p class="text-balance text-slate-600">Enter your new password</p>
    </div>

    <form class="flex flex-col gap-4" onsubmit={handleSubmit}>
      {#if !passwordUpdated}
        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-slate-700"
            >New password</label
          >
          <input
            id="password"
            type="password"
            minlength="6"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            bind:value={password}
            required
            disabled={$authLoading || isSubmitting}
          />
        </div>
        <div>
          <label for="confirmPassword" class="mb-1 block text-sm font-medium text-slate-700"
            >Confirm new password</label
          >
          <input
            id="confirmPassword"
            type="password"
            minlength="6"
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
          {isSubmitting ? 'Loading…' : 'Update password'}
        </button>
      {:else}
        <div class="rounded-lg bg-green-50 p-4 text-center text-sm text-green-700">
          <p>Password updated.</p>
          <p class="mt-2 text-xs text-green-600">Signing out and redirecting…</p>
        </div>
      {/if}
    </form>

    <p class="mt-6 text-center text-sm">
      <button
        type="button"
        class="text-slate-600 hover:underline"
        onclick={handleBackToLogin}
      >
        Back to login
      </button>
    </p>
  </div>
</div>
