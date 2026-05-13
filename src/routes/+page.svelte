<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import ImageIcon from '@lucide/svelte/icons/image';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';

	const MODELS = [
		{
			id: 'google/gemini-3.1-flash-image-preview',
			name: 'Nano Banana 2 ',
			note: 'Google'
		},
		{
			id: 'google/gemini-3-pro-image-preview',
			name: 'Nano Banana Pro',
			note: 'Google'
		},
		{
			id: 'openai/gpt-5.4-image-2',
			name: 'GPT Image 2',
			note: 'OpenAI'
		}
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
	let imageUrl = $state<string | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	const selectedModel = $derived(MODELS.find((m) => m.id === model));
	const selectedSize = $derived(SIZES.find((s) => s.id === size));

	async function generate() {
		if (!apiKey.trim() || !prompt.trim()) return;
		loading = true;
		error = null;
		imageUrl = null;

		try {
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
					messages: [{ role: 'user', content: prompt }],
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
			if (!imageUrl) error = 'No image returned';
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

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') generate();
	}
</script>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b border-border/60 px-6 py-4">
		<div class="mx-auto flex max-w-2xl items-center justify-between">
			<div class="flex items-center gap-2">
				<ImageIcon class="size-5 text-primary" />
				<span class="font-mono text-sm font-semibold tracking-tight text-foreground"
					>byok imagen</span
				>
			</div>
			<div class="flex items-center gap-1.5">
				<ShieldCheckIcon class="size-3.5 text-muted-foreground" />
				<span class="font-mono text-xs text-muted-foreground">client-side only</span>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-2xl space-y-6 px-6 py-8">
		<!-- API Key -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<Label for="api-key" class="font-mono text-xs">OpenRouter API Key</Label>
				<Badge variant="secondary" class="gap-1 font-mono text-xs">
					<EyeOffIcon class="size-3" />
					session only · never stored
				</Badge>
			</div>
			<Input
				id="api-key"
				type="password"
				placeholder="sk-or-v1-..."
				bind:value={apiKey}
				class="font-mono text-xs"
				autocomplete="off"
			/>
			<p class="font-mono text-xs text-muted-foreground">
				Key lives in browser memory only. Check Network tab — all requests go to
				<span class="text-foreground">openrouter.ai</span>, not this domain.
			</p>
		</div>

		<!-- Model + Size -->
		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-2">
				<Label class="font-mono text-xs">Model</Label>
				<Select type="single" bind:value={model}>
					<SelectTrigger class="w-full font-mono text-xs">
						{selectedModel?.name ?? 'Select model'}
					</SelectTrigger>
					<SelectContent>
						{#each MODELS as m (m.id)}
							<SelectItem value={m.id} class="font-mono text-xs">
								<span>{m.name}</span>
								<span class="ml-auto pl-4 text-muted-foreground">{m.note}</span>
							</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>

			<div class="space-y-2">
				<Label class="font-mono text-xs">Size</Label>
				<Select type="single" bind:value={size}>
					<SelectTrigger class="w-full font-mono text-xs">
						{selectedSize?.note ?? 'Select size'}
					</SelectTrigger>
					<SelectContent>
						{#each SIZES as s (s.id)}
							<SelectItem value={s.id} class="font-mono text-xs">
								<span>{s.note}</span>
								<span class="ml-auto pl-4 text-muted-foreground">{s.id}</span>
							</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>
		</div>

		<!-- Prompt -->
		<div class="space-y-2">
			<Label for="prompt" class="font-mono text-xs">Prompt</Label>
			<Textarea
				id="prompt"
				placeholder="A photorealistic image of..."
				bind:value={prompt}
				onkeydown={handleKeydown}
				rows={4}
				class="resize-none font-mono text-xs"
			/>
			<p class="font-mono text-xs text-muted-foreground">⌘ Enter to generate</p>
		</div>

		<!-- Generate -->
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

		<!-- Error -->
		{#if error}
			<div class="border border-destructive/40 bg-destructive/5 p-3">
				<p class="font-mono text-xs text-destructive">{error}</p>
			</div>
		{/if}

		<!-- Image output -->
		{#if imageUrl}
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label class="font-mono text-xs">Output</Label>
					<Button variant="ghost" size="sm" onclick={download} class="h-7 gap-1 font-mono text-xs">
						<DownloadIcon class="size-3" />
						download
					</Button>
				</div>
				<div class="border border-border">
					<img src={imageUrl} alt={prompt} class="w-full" />
				</div>
			</div>
		{/if}

		<!-- Loading skeleton -->
		{#if loading}
			<div class="border border-border">
				<div
					class="flex aspect-square items-center justify-center bg-muted"
					style="aspect-ratio: {size.replace(':', '/')};"
				>
					<div class="flex flex-col items-center gap-2">
						<LoaderIcon class="size-6 animate-spin text-muted-foreground" />
						<span class="font-mono text-xs text-muted-foreground"
							>generating with {selectedModel?.name}...</span
						>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
