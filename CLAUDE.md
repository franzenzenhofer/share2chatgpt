# CLAUDE.md — share2chatgpt

## What This Is

An embeddable "Share to ChatGPT" button widget. Pure vanilla JS, no build step, hosted on GitHub Pages.

## File Structure

- `share2chatgpt.js` — The widget (IIFE, self-initializing, ~3KB)
- `index.html` — Landing page with configurator
- `go/index.html` — Redirect page (URL params to chatgpt.com)
- `README.md` — Documentation
- No package.json. No build. No dependencies.

## Key Technical Details

- ChatGPT URL: `https://chatgpt.com/?q=<prompt>&model=<model>&hints=<hints>`
- CSS is injected via JS with `s2c-` prefix for scoping
- Widget scans for `[data-share2chatgpt]` elements on DOMContentLoaded
- Public API: `window.Share2ChatGPT = { version, init, buildUrl }`

## Testing

Just open `index.html` in a browser. No server needed.
