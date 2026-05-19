<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import ApiKey from '$lib/components/ApiKey.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import Header from '$lib/components/Header.svelte';
	import HistoryGrid from '$lib/components/HistoryGrid.svelte';
	import ImageOutput from '$lib/components/ImageOutput.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import ModelSize from '$lib/components/ModelSize.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import ReferenceImages from '$lib/components/ReferenceImages.svelte';
	import { history } from '$lib/history.svelte.js';
	import LoaderIcon from '@lucide/svelte/icons/loader';

	$effect(() => {
		history.init();
	});

	const MODELS = [
		{ id: 'google/gemini-3.1-flash-image-preview', name: 'Nano Banana 2', note: 'Google' },
		{ id: 'google/gemini-3-pro-image-preview', name: 'Nano Banana Pro', note: 'Google' },
		{ id: 'openai/gpt-5.4-image-2', name: 'GPT Image 2', note: 'OpenAI' },
		{ id: 'openai/gpt-5-image-mini', name: 'GPT Image Mini', note: 'OpenAI' }
	];

	const SIZES = [
		{ id: '1:1', note: 'Square' },
		{ id: '9:16', note: 'Portrait' },
		{ id: '16:9', note: 'Landscape' },
		{ id: '4:3', note: 'Standard' }
	];

	let apiKey = $state('');
	let model = $state(MODELS[0].id);
	let size = $state(SIZES[0].id);
	let prompt = $state('');
	let referenceImages = $state<string[]>([]);
	let imageUrl = $state<string | null>(null);
	let generationCost = $state<number | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	const selectedModel = $derived(MODELS.find((m) => m.id === model));

	async function generate() {
		if (!apiKey.trim() || !prompt.trim()) return;
		loading = true;
		error = null;
		imageUrl = null;
		generationCost = null;

		try {
			const content =
				referenceImages.length > 0
					? [
							{ type: 'text', text: prompt },
							...referenceImages.map((url) => ({
								type: 'image_url',
								image_url: { url }
							}))
						]
					: prompt;

			const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
					'HTTP-Referer': window.location.origin,
					'X-Title': 'BYOK Imagen'
				},
				body: JSON.stringify({
					model,
					messages: [{ role: 'user', content }],
					modalities: ['image', 'text'],
					image_config: { aspect_ratio: size }
				})
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error?.message ?? `Error ${res.status}`;
				return;
			}

			const images = data.choices?.[0]?.message?.images;
			imageUrl = images?.[0]?.image_url?.url ?? null;
			if (!imageUrl) {
				error = 'No image returned';
				return;
			}
			generationCost = data.usage?.cost ?? null;
			history.add({
				imageUrl,
				prompt,
				modelId: model,
				modelName: selectedModel?.name ?? model,
				size,
				cost: generationCost
			});
		} catch (e) {
			error = e instanceof Error ? e.message : 'Network error';
		} finally {
			loading = false;
		}
	}

	function download() {
		if (!imageUrl) return;
		const a = document.createElement('a');
		a.href = imageUrl;
		a.download = `imagen-${Date.now()}.png`;
		a.click();
	}
</script>

<div class="min-h-screen bg-background">
	<Header />

	<main class="mx-auto max-w-2xl space-y-6 px-6 py-8">
		<ApiKey bind:apiKey />

		<ModelSize bind:model bind:size models={MODELS} sizes={SIZES} />

		<ReferenceImages bind:images={referenceImages} />

		<Prompt bind:prompt onGenerate={generate} />

		<Button
			onclick={generate}
			disabled={loading || !apiKey.trim() || !prompt.trim()}
			class="w-full font-mono text-xs"
		>
			{#if loading}
				<LoaderIcon class="size-3.5 animate-spin" />
				generating...
			{:else}
				generate
			{/if}
		</Button>

		{#if error}
			<ErrorDisplay {error} />
		{/if}

		{#if imageUrl}
			<ImageOutput {imageUrl} {generationCost} {prompt} onDownload={download} />
		{/if}

		{#if loading}
			<LoadingSkeleton {size} modelName={selectedModel?.name ?? ''} />
		{/if}

		<HistoryGrid />
	</main>
</div>
