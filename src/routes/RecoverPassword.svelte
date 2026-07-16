<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { authLoading, resetPassword } from '@/lib/auth';
  import { toastError, toastSuccess } from '@/lib/toast';

  let email = $state('');
  let isSubmitting = $state(false);
  let emailSent = $state(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    isSubmitting = true;
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toastError(error.message || 'Failed to send reset email');
      } else {
        toastSuccess('Reset link sent to your email');
        emailSent = true;
      }
    } catch {
      toastError('An unexpected error occurred');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="flex flex-col items-center justify-center py-8">
  <div class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-slate-900">Recover password</h1>
      <p class="text-balance text-slate-600">Enter your email to receive a reset link</p>
    </div>

    <form class="flex flex-col gap-4" onsubmit={handleSubmit}>
      {#if !emailSent}
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
        <button
          type="submit"
          class="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          disabled={$authLoading || isSubmitting}
        >
          {isSubmitting ? 'Loading…' : 'Send reset link'}
        </button>
      {:else}
        <div class="rounded-lg bg-green-50 p-4 text-center text-sm text-green-700">
          Reset link sent to your email.
        </div>
      {/if}
    </form>

    <p class="mt-6 text-center text-sm">
      <a href="/login" use:link class="text-slate-600 hover:underline">Back to login</a>
    </p>
  </div>
</div>
