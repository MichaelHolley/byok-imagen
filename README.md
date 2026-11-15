# BYOK Imagen

Bring Your Own Key image generation. Paste an [OpenRouter](https://openrouter.ai) API key, pick a model and an optional aspect ratio, generate images — all from the browser. No server, no data collection. History persists in localStorage.

## Requirements

- [OpenRouter](https://openrouter.ai) API key with credits

## Setup

```sh
pnpm install
pnpm dev
```

Enter your OpenRouter API key in the UI on first load. The key is held in session memory only and never sent anywhere except directly to OpenRouter.

## Aspect ratio

Square (1:1) is selected by default. Choose **Auto** to leave the aspect ratio unset, including when editing reference images. Auto omits `aspect_ratio` from the OpenRouter request and lets each model decide the output shape; preserving a reference image's original ratio is model-dependent, not guaranteed.

Fixed ratios are still available. If a model does not support the selected ratio, the closest supported ratio is used. Models without aspect-ratio support always use their own default.

## Stack

- SvelteKit 2 + Svelte 5 (runes)
- Tailwind CSS 4 + shadcn-svelte
- Deployed on Vercel
