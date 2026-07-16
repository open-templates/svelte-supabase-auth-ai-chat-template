<script lang="ts">
  import { toasts } from '@/lib/toast';
</script>

<div class="pointer-events-none fixed right-4 top-4 z-[100] flex max-w-sm flex-col gap-2">
  {#each $toasts as toast (toast.id)}
    <div
      class="pointer-events-auto rounded-md border px-4 py-3 text-sm shadow-md {toast.kind ===
      'error'
        ? 'border-red-200 bg-red-50 text-red-800'
        : 'border-green-200 bg-green-50 text-green-800'}"
      role="status"
    >
      {toast.message}
    </div>
  {/each}
</div>
