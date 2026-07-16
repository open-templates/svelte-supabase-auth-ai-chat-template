<script lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';

  let { content }: { content: string } = $props();

  marked.setOptions({ gfm: true, breaks: true });

  const html = $derived(
    DOMPurify.sanitize(marked.parse(content, { async: false }) as string),
  );
</script>

<div class="chat-markdown break-words">
  {@html html}
</div>
