# AGENTS.md

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

- `src/lib/models.ts` — model/size catalogue (`MODELS`, `SIZES`).
- `src/lib/openrouter.ts` — pure API client. `generateImage()` does one request and throws on failure. No Svelte, no state.
- `src/lib/generations.svelte.ts` — parallel run orchestrator. Owns the `Job[]` state.
- `src/lib/history.svelte.ts` — IndexedDB-backed history state.
- `src/lib/components/` — feature components (ApiKey, Prompt, ModelSelect, ReferenceImages, etc.)
- `src/lib/components/ui/` — shadcn-svelte primitives (button, card, input, select, switch, etc.)

**State:** Form inputs (`apiKey`, `models`, `size`, `prompt`, `referenceImages`) live in `+page.svelte`. Generation results live in `generations.svelte.ts`; history in `history.svelte.ts`, initialized once via `$effect(() => { history.init(); })`.

**Parallel generation:** Users select multiple models. `generations.run()` creates one `Job` per model and fires them all concurrently, each settling its own object in the reactive array — so a fast model renders immediately instead of waiting on a slow one. All jobs share one `AbortController` for `cancel()`. Successful jobs write to history as they land.

**Svelte 5 runes mode** is enforced project-wide (`runes: true` in `svelte.config.js`). Use `$state`, `$derived`, `$effect`, `$props` — not legacy stores or reactive labels.

**Styling:** Tailwind CSS 4 + shadcn-svelte. Add shadcn components with `pnpm dlx shadcn-svelte@latest add <component>`.

**Deployment:** Vercel (`@sveltejs/adapter-vercel`).

## Adding a model to `src/lib/models.ts`

Generation goes through `POST /api/v1/images`. Verify the model there before adding it:

```sh
curl -s https://openrouter.ai/api/v1/images/models | jq '.data[] | select(.id == "<model-id>")'
```

- **Do not check `/api/v1/models`.** It omits image models entirely, so a valid model looks
  missing and an invalid one is indistinguishable from it.
- Copy `aspectRatios` verbatim from `supported_parameters.aspect_ratio.values`. Use `[]` when
  `supported_parameters` is empty — that model takes no parameters and `aspect_ratio` must be
  omitted from the request.
- A ratio in `SIZES` that the model doesn't list is mapped to the numerically closest supported
  aspect ratio. Models with no supported parameters still omit `aspect_ratio` entirely.

`supported_parameters.input_references.max` is the model's reference-image cap. It ranges from 0
(Muse Image) to 16, and `ReferenceImages.svelte` currently enforces a flat `MAX_FILES = 4` across
all models rather than reading it.
