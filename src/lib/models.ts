/** `aspectRatios` mirrors the model's descriptor at /api/v1/images/models. An empty list means
 * the model takes no parameters at all, so `aspect_ratio` must be omitted from the request. */
export type Company = 'Google' | 'OpenAI' | 'Microsoft' | 'Meta';
export type Model = {
	id: string;
	name: string;
	note: Company;
	aspectRatios: string[];
	/** Relative API cost per generated image, omitted when unknown. */
	pricing?: '$' | '$$' | '$$$';
};
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
		],
		pricing: '$$'
	},
	{
		id: 'google/gemini-3-pro-image-preview',
		name: 'Nano Banana Pro',
		note: 'Google',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'],
		pricing: '$$$'
	},
	{
		id: 'openai/gpt-5.4-image-2',
		name: 'GPT Image 2',
		note: 'OpenAI',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', 'auto'],
		pricing: '$$$'
	},
	{
		id: 'openai/gpt-5-image-mini',
		name: 'GPT Image Mini',
		note: 'OpenAI',
		aspectRatios: ['1:1', '2:3', '3:2', 'auto'],
		pricing: '$'
	},
	{
		id: 'openai/gpt-image-2.5-sunburst',
		name: 'GPT Image 2.5 Sunburst',
		note: 'OpenAI',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', 'auto'],
		pricing: '$$$'
	},
	{
		id: 'openai/gpt-image-2.5-flare',
		name: 'GPT Image 2.5 Flare',
		note: 'OpenAI',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', 'auto'],
		pricing: '$'
	},
	{
		id: 'microsoft/mai-image-2.6',
		name: 'MAI-Image 2.6',
		note: 'Microsoft',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', 'auto'],
		pricing: '$'
	},
	{
		id: 'microsoft/mai-image-2.6-flash',
		name: 'MAI-Image 2.6 Flash',
		note: 'Microsoft',
		aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', 'auto'],
		pricing: '$'
	},
	{
		id: 'meta/muse-image',
		name: 'Muse Image',
		note: 'Meta',
		aspectRatios: [],
		pricing: '$'
	}
];

export const SIZES: Size[] = [
	{ id: '1:1', note: 'Square' },
	{ id: '2:3', note: 'Poster' },
	{ id: '3:2', note: 'Photo' },
	{ id: '3:4', note: 'Classic portrait' },
	{ id: '4:3', note: 'Standard' },
	{ id: '4:5', note: 'Portrait print' },
	{ id: '5:4', note: 'Landscape print' },
	{ id: '9:16', note: 'Story' },
	{ id: '16:9', note: 'Widescreen' },
	{ id: '21:9', note: 'Cinematic' },
	{ id: '1:4', note: 'Vertical panorama' },
	{ id: '4:1', note: 'Horizontal panorama' },
	{ id: '1:8', note: 'Ultra-tall' },
	{ id: '8:1', note: 'Ultra-wide' }
];

export function modelName(id: string): string {
	return MODELS.find((m) => m.id === id)?.name ?? id;
}

function ratioValue(ratio: string): number {
	const [width, height] = ratio.split(':').map(Number);
	return width / height;
}

/** The exact or closest supported size, or null when the model takes no aspect ratio. */
export function requestableAspectRatio(id: string, size: string): string | null {
	const model = MODELS.find((m) => m.id === id);
	if (!model || model.aspectRatios.length === 0) return null;
	if (model.aspectRatios.includes(size)) return size;

	const numericRatios = model.aspectRatios.filter((ratio) => ratio !== 'auto');
	const target = ratioValue(size);
	return (
		numericRatios.reduce<string | null>((closest, ratio) => {
			if (closest === null) return ratio;
			return Math.abs(ratioValue(ratio) - target) < Math.abs(ratioValue(closest) - target)
				? ratio
				: closest;
		}, null) ?? null
	);
}
