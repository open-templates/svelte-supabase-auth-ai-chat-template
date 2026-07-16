<script lang="ts">
  import type { ChatThread } from '@/lib/chat-threads';
  import { formatThreadTime } from '@/lib/chat-threads';

  let {
    threads,
    activeThreadId,
    onSelect,
    onNewChat,
    onDelete,
  }: {
    threads: ChatThread[];
    activeThreadId: string | null;
    onSelect: (id: string) => void;
    onNewChat: () => void;
    onDelete: (id: string) => void;
  } = $props();
</script>

<aside
  class="flex w-full shrink-0 flex-col border-b border-slate-200 bg-slate-100/50 md:w-56 md:border-b-0 md:border-r"
>
  <div class="p-3">
    <button
      type="button"
      class="flex w-full items-center justify-start gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
      onclick={onNewChat}
    >
      <span aria-hidden="true">+</span>
      New chat
    </button>
  </div>

  <nav
    class="flex max-h-40 gap-2 overflow-x-auto px-2 pb-3 md:max-h-none md:flex-1 md:flex-col md:overflow-y-auto md:pb-2"
  >
    {#if threads.length === 0}
      <p class="px-2 py-4 text-center text-xs text-slate-500 md:text-left">
        Chats appear here for this browser session.
      </p>
    {/if}

    {#each threads as thread (thread.id)}
      {@const active = thread.id === activeThreadId}
      <div class="group relative shrink-0 md:shrink">
        <button
          type="button"
          onclick={() => onSelect(thread.id)}
          class="w-44 rounded-lg px-3 py-2 text-left text-sm transition-colors md:w-full {active
            ? 'bg-white shadow-sm ring-1 ring-slate-200'
            : 'hover:bg-white/70'}"
        >
          <p class="truncate font-medium text-slate-900">{thread.title}</p>
          <p class="mt-0.5 truncate text-xs text-slate-500">
            {formatThreadTime(thread.updatedAt)}
          </p>
        </button>
        <button
          type="button"
          class="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-slate-200 group-hover:opacity-100 md:right-0.5"
          aria-label="Delete {thread.title}"
          onclick={(e) => {
            e.stopPropagation();
            onDelete(thread.id);
          }}
        >
          <span class="text-xs text-slate-500" aria-hidden="true">✕</span>
        </button>
      </div>
    {/each}
  </nav>
</aside>
