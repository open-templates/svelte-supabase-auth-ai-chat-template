---
type: Playbook
title: Chat markdown
description: Render assistant replies with marked (GFM) and DOMPurify.
tags: [markdown, ui]
timestamp: 2026-07-15T00:00:00Z
resource: src/components/ChatMarkdown.svelte
---

# Usage

```svelte
{#if msg.role === 'assistant'}
  <ChatMarkdown content={msg.content} />
{:else}
  {msg.content}
{/if}
```

Tailwind-styled element rules under `.chat-markdown` in `src/app.css`.

See [specs/features/09-markdown-replies.md](../../specs/features/09-markdown-replies.md).
