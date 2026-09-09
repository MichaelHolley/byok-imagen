export type Model = { id: string; name: string; note: string };
export type Size = { id: string; note: string };

export const MODELS: Model[] = [
	{ id: 'google/gemini-3.1-flash-image-preview', name: 'Nano Banana 2', note: 'Google' },
	{ id: 'google/gemini-3-pro-image-preview', name: 'Nano Banana Pro', note: 'Google' },
	{ id: 'openai/gpt-5.4-image-2', name: 'GPT Image 2', note: 'OpenAI' },
	{ id: 'openai/gpt-5-image-mini', name: 'GPT Image Mini', note: 'OpenAI' },
	{ id: 'openai/gpt-image-2.5-sunburst', name: 'GPT Image 2.5 Sunburst', note: 'OpenAI' },
	{ id: 'openai/gpt-image-2.5-flare', name: 'GPT Image 2.5 Flare', note: 'OpenAI' },
	{ id: 'microsoft/mai-image-2.6', name: 'MAI-Image 2.6', note: 'Microsoft' },
	{ id: 'microsoft/mai-image-2.6-flash', name: 'MAI-Image 2.6 Flash', note: 'Microsoft' },
	{ id: 'meta/muse-image', name: 'Muse Image', note: 'Meta' }
];

export const SIZES: Size[] = [
	{ id: '1:1', note: 'Square' },
	{ id: '9:16', note: 'Portrait' },
	{ id: '16:9', note: 'Landscape' },
	{ id: '4:3', note: 'Standard' }
];

export function modelName(id: string): string {
	return MODELS.find((m) => m.id === id)?.name ?? id;
}
