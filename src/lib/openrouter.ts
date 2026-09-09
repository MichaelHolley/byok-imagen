const ENDPOINT = 'https://openrouter.ai/api/v1/images';

export type GenerateParams = {
	apiKey: string;
	model: string;
	prompt: string;
	aspectRatio: string | null;
	referenceImages?: string[];
	signal?: AbortSignal;
};

export type GeneratedImage = {
	imageUrl: string;
	cost: number | null;
};

/** Single image generation against OpenRouter. Throws on any non-success outcome. */
export async function generateImage({
	apiKey,
	model,
	prompt,
	aspectRatio,
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
			prompt,
			n: 1,
			...(aspectRatio && { aspect_ratio: aspectRatio }),
			...(referenceImages.length > 0 && {
				input_references: referenceImages.map((url) => ({
					type: 'image_url',
					image_url: { url }
				}))
			})
		})
	});

	const data = await res.json();

	if (!res.ok) throw new Error(data.error?.message ?? `Error ${res.status}`);

	const image = data.data?.[0];
	if (!image?.b64_json) throw new Error('No image returned');

	return {
		imageUrl: `data:${image.media_type ?? 'image/png'};base64,${image.b64_json}`,
		cost: data.usage?.cost ?? null
	};
}
