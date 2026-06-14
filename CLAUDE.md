# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm dev          # start dev server
pnpm build        # production build
pnpm preview      # preview production build
pnpm check        # svelte-check type checking
pnpm lint         # prettier + eslint
pnpm format       # prettier write
```

## Architecture

Single-page SvelteKit app. No backend — all API calls go directly from the browser to OpenRouter.

**Key files:**
- `src/lib/components/` — feature components (ApiKey, Prompt, ModelSize, ReferenceImages, etc.)
- `src/lib/components/ui/` — shadcn-svelte primitives (button, card, input, select, switch, etc.)

**State:** All generation state (`apiKey`, `model`, `size`, `prompt`, `imageUrl`, etc.) lives in `+page.svelte`. History state lives in `history.svelte.ts` and is initialized once via `$effect(() => { history.init(); })`.

**Svelte 5 runes mode** is enforced project-wide (`runes: true` in `svelte.config.js`). Use `$state`, `$derived`, `$effect`, `$props` — not legacy stores or reactive labels.

**Styling:** Tailwind CSS 4 + shadcn-svelte. Add shadcn components with `pnpm dlx shadcn-svelte@latest add <component>`.

**Deployment:** Vercel (`@sveltejs/adapter-vercel`).
