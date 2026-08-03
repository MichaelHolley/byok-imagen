const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export type GenerateParams = {
	apiKey: string;
	model: string;
	prompt: string;
	size: string;
	referenceImages?: string[];
	signal?: AbortSignal;
};

export type GeneratedImage = {
	imageUrl: string;
	cost: number | null;
};

function buildContent(prompt: string, referenceImages: string[]) {
	if (referenceImages.length === 0) return prompt;
	return [
		{ type: 'text', text: prompt },
		...referenceImages.map((url) => ({ type: 'image_url', image_url: { url } }))
	];
}

/** Single image generation against OpenRouter. Throws on any non-success outcome. */
export async function generateImage({
	apiKey,
	model,
	prompt,
	size,
	referenceImages = [],
	signal
}: GenerateParams): Promise<GeneratedImage> {
	const res = await fetch(ENDPOINT, {
		method: 'POST',
		signal,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': window.location.origin,
			'X-Title': 'BYOK Imagen'
		},
		body: JSON.stringify({
			model,
			messages: [{ role: 'user', content: buildContent(prompt, referenceImages) }],
			modalities: ['image', 'text'],
			image_config: { aspect_ratio: size }
		})
	});

	const data = await res.json();

	if (!res.ok) throw new Error(data.error?.message ?? `Error ${res.status}`);

	const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
	if (!imageUrl) throw new Error('No image returned');

	return { imageUrl, cost: data.usage?.cost ?? null };
}
