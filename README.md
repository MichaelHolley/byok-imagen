# BYOK Imagen

Bring Your Own Key image generation. Paste an [OpenRouter](https://openrouter.ai) API key, pick a model and aspect ratio, generate images — all from the browser. No server, no data collection. History persists in localStorage.

The model picker includes OpenAI's GPT Image 2.6 Sunburst and Flare alongside the existing GPT Image 2.5 variants. Both 2.6 models support reference images; unsupported aspect ratios are mapped to the closest supported ratio.

## Requirements

- [OpenRouter](https://openrouter.ai) API key with credits

## Setup

```sh
pnpm install
pnpm dev
```

Enter your OpenRouter API key in the UI on first load. The key is held in session memory only and never sent anywhere except directly to OpenRouter.

## Stack

- SvelteKit 2 + Svelte 5 (runes)
- Tailwind CSS 4 + shadcn-svelte
- Deployed on Vercel
