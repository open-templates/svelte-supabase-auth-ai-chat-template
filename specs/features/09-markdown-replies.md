---
type: Feature
title: Markdown replies
description: GFM rendering for assistant message bubbles.
tags: [ai, chat, markdown]
timestamp: 2026-07-15T00:00:00Z
resource: src/components/ChatMarkdown.svelte
---

# Assistant markdown

Assistant bubbles render via `marked` (GFM) and sanitize HTML with `DOMPurify`.

Styles live under `.chat-markdown` in `src/app.css`.

See [.agents/skills/modules/chat-markdown.md](../../.agents/skills/modules/chat-markdown.md).
