<script lang="ts">
  import { tick } from 'svelte';
  import { sendChatMessage } from '@/lib/chat';
  import ChatSidebar from '@/components/ChatSidebar.svelte';
  import ChatMarkdown from '@/components/ChatMarkdown.svelte';
  import {
    createThread,
    deleteThread,
    getActiveThreadId,
    loadChatState,
    setActiveThreadId,
    titleFromMessage,
    upsertThread,
    type ChatMessage,
    type ChatThread,
  } from '@/lib/chat-threads';

  function resolveInitialThread(): ChatThread {
    const { threads, activeThreadId } = loadChatState();
    if (threads.length === 0) {
      return createThread();
    }
    const active = threads.find((t) => t.id === activeThreadId) ?? threads[0];
    setActiveThreadId(active.id);
    return active;
  }

  let threads = $state<ChatThread[]>(loadChatState().threads);
  let activeThread = $state<ChatThread>(resolveInitialThread());
  let input = $state('');
  let loading = $state(false);
  let error = $state<string | null>(null);
  let bottomEl = $state<HTMLDivElement | null>(null);

  let messages = $derived(activeThread.messages);

  $effect(() => {
    void messages;
    void loading;
    void activeThread.id;
    tick().then(() => {
      bottomEl?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  function syncThread(thread: ChatThread) {
    upsertThread(thread);
    threads = loadChatState().threads;
    activeThread = thread;
    setActiveThreadId(thread.id);
  }

  function handleNewChat() {
    const thread = createThread();
    threads = loadChatState().threads;
    activeThread = thread;
    input = '';
    error = null;
  }

  function handleSelectThread(id: string) {
    const thread = threads.find((t) => t.id === id);
    if (!thread) return;
    setActiveThreadId(id);
    activeThread = thread;
    input = '';
    error = null;
  }

  function handleDeleteThread(id: string) {
    deleteThread(id);
    const next = loadChatState();
    threads = next.threads;
    if (next.threads.length === 0) {
      activeThread = createThread();
      threads = loadChatState().threads;
      return;
    }
    const activeId = getActiveThreadId();
    const thread = next.threads.find((t) => t.id === activeId) ?? next.threads[0];
    activeThread = thread;
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const history = activeThread.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const withUser: ChatThread = {
      ...activeThread,
      title:
        activeThread.messages.length === 0 ? titleFromMessage(trimmed) : activeThread.title,
      messages: [...activeThread.messages, userMsg],
    };

    syncThread(withUser);
    input = '';
    loading = true;
    error = null;

    const { data, error: apiError } = await sendChatMessage(trimmed, history);
    loading = false;

    if (apiError || !data) {
      error = apiError ?? 'Failed to get a reply';
      return;
    }

    const withReply: ChatThread = {
      ...withUser,
      messages: [
        ...withUser.messages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply,
        },
      ],
    };

    syncThread(withReply);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }
</script>

<div class="chat-full-bleed flex h-[calc(100vh-3.5rem)] flex-col md:flex-row">
  <ChatSidebar
    {threads}
    activeThreadId={activeThread.id}
    onSelect={handleSelectThread}
    onNewChat={handleNewChat}
    onDelete={handleDeleteThread}
  />

  <div class="flex min-h-0 flex-1 flex-col p-4">
    <div class="mb-4">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">AI Chat</h1>
      <p class="mt-1 text-sm text-slate-600">
        Each thread keeps context for follow-up messages. History is stored in this browser
        session only.
      </p>
    </div>

    <div class="flex min-h-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white">
      <div class="flex-1 space-y-4 overflow-y-auto p-4">
        {#if messages.length === 0 && !loading}
          <p class="py-12 text-center text-sm text-slate-500">
            Send a message to start this conversation.
          </p>
        {/if}

        {#each messages as msg (msg.id)}
          <div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div
              class="max-w-[85%] rounded-lg px-4 py-2 text-sm {msg.role === 'user'
                ? 'whitespace-pre-wrap bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-900'}"
            >
              {#if msg.role === 'assistant'}
                <ChatMarkdown content={msg.content} />
              {:else}
                {msg.content}
              {/if}
            </div>
          </div>
        {/each}

        {#if loading}
          <div class="flex justify-start">
            <div
              class="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600"
            >
              <div
                class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
                role="status"
                aria-label="Loading"
              ></div>
              Thinking…
            </div>
          </div>
        {/if}

        <div bind:this={bottomEl}></div>
      </div>

      {#if error}
        <p class="border-t border-slate-200 px-4 py-2 text-sm text-red-600">{error}</p>
      {/if}

      <div class="flex gap-2 border-t border-slate-200 p-4">
        <textarea
          bind:value={input}
          onkeydown={onKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          rows="2"
          disabled={loading}
          class="flex min-h-10 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        ></textarea>
        <button
          type="button"
          class="shrink-0 self-end rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading || !input.trim()}
          onclick={() => void handleSend()}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</div>
