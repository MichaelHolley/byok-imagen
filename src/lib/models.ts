/** `aspectRatios` mirrors the model's descriptor at /api/v1/images/models. An empty list means
 * the model takes no parameters at all, so `aspect_ratio` must be omitted from the request. */
export type Model = { id: string; name: string; note: string; aspectRatios: string[] };
export type Size = { id: string; note: string };

export const MODELS: Model[] = [
	{
		id: 'google/gemini-3.1-flash-image-preview',
		name: 'Nano Banana 2',
		note: 'Google',
		aspectRatios: [
			'1:1',
			'1:4',
			'1:8',
			'2:3',
			'3:2',
			'3:4',
			'4:1',
			'4:3',
			'4:5',
			'5:4',
			'8:1',
			'9:16',
			'16:9',
			'21:9'
		]
	},
	{
		id: 'google/gemini-3-pro-image-preview',
		name: 'Nano Banana Pro',
		note: 'Google',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']
	},
	{
		id: 'openai/gpt-5.4-image-2',
		name: 'GPT Image 2',
		note: 'OpenAI',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', 'auto']
	},
	{
		id: 'openai/gpt-5-image-mini',
		name: 'GPT Image Mini',
		note: 'OpenAI',
		aspectRatios: ['1:1', '2:3', '3:2', 'auto']
	},
	{
		id: 'openai/gpt-image-2.5-sunburst',
		name: 'GPT Image 2.5 Sunburst',
		note: 'OpenAI',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', 'auto']
	},
	{
		id: 'openai/gpt-image-2.5-flare',
		name: 'GPT Image 2.5 Flare',
		note: 'OpenAI',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', 'auto']
	},
	{
		id: 'microsoft/mai-image-2.6',
		name: 'MAI-Image 2.6',
		note: 'Microsoft',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', 'auto']
	},
	{
		id: 'microsoft/mai-image-2.6-flash',
		name: 'MAI-Image 2.6 Flash',
		note: 'Microsoft',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', 'auto']
	},
	{ id: 'meta/muse-image', name: 'Muse Image', note: 'Meta', aspectRatios: [] }
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

/** The size to request, or null when the model can't honour it and must fall back to its default. */
export function requestableAspectRatio(id: string, size: string): string | null {
	const model = MODELS.find((m) => m.id === id);
	return model?.aspectRatios.includes(size) ? size : null;
}
