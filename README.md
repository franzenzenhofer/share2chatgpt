# share2chatgpt

Add a "Share to ChatGPT" button to any website. Zero dependencies. Under 3KB. One script tag.

## Quick Start

```html
<div data-share2chatgpt></div>
<script src="https://cdn.jsdelivr.net/gh/franzenzenhofer/share2chatgpt@latest/share2chatgpt.js" async></script>
```

The button auto-detects your page URL and title.

## Configuration

Everything is configurable via `data-*` attributes:

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-url` | Current page | URL to discuss |
| `data-title` | document.title | Page title |
| `data-text` | empty | Custom text snippet |
| `data-prompt` | Per language | Prompt template with `{url}`, `{title}`, `{text}` |
| `data-hints` | omitted | ChatGPT hints: `search` (enables web search) |
| `data-temporary-chat` | omitted | Set to `true` for a temporary chat (no history) |
| `data-theme` | light | light, dark, or minimal |
| `data-size` | md | sm, md, or lg |
| `data-label` | Per language | Custom button text |
| `data-lang` | en | en, de, es, fr |

## Full Example

```html
<div data-share2chatgpt
     data-url="https://franzenzenhofer.github.io/share2chatgpt/"
     data-prompt="Summarize and list 3 key takeaways: {url}"
     data-theme="dark"
     data-size="lg"
     data-hints="search"
     data-temporary-chat="true"
     data-label="Ask ChatGPT"></div>
<script src="https://cdn.jsdelivr.net/gh/franzenzenhofer/share2chatgpt@latest/share2chatgpt.js" async></script>
```

## Redirect URL (no widget needed)

Link directly without embedding:

```
https://franzenzenhofer.github.io/share2chatgpt/go/?url=https://example.com&lang=en
```

## JavaScript API

```js
// Re-scan DOM after dynamic content
Share2ChatGPT.init();

// Build URL programmatically
var url = Share2ChatGPT.buildUrl({ url: 'https://example.com', lang: 'en' });
window.open(url, '_blank');
```

## How It Works

The widget constructs a `chatgpt.com/?q=<prompt>` URL using ChatGPT's `?q=` parameter to prefill prompts. It also supports `?hints=search` (web search mode) and `?temporary-chat=true` (no history saved).

## No tracking. No cookies. No dependencies.

This is a pure client-side widget. Nothing is sent to any server. The button just opens a ChatGPT URL.

## License

See [LICENSE](LICENSE).
