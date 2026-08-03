<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import ApiKey from '$lib/components/ApiKey.svelte';
	import Header from '$lib/components/Header.svelte';
	import HistoryGrid from '$lib/components/HistoryGrid.svelte';
	import ModelSelect from '$lib/components/ModelSelect.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import ReferenceImages from '$lib/components/ReferenceImages.svelte';
	import ResultsGrid from '$lib/components/ResultsGrid.svelte';
	import SizeSelect from '$lib/components/SizeSelect.svelte';
	import { generations } from '$lib/generations.svelte.js';
	import { history } from '$lib/history.svelte.js';
	import { MODELS, SIZES } from '$lib/models.js';
	import LoaderIcon from '@lucide/svelte/icons/loader';

	$effect(() => {
		history.init();
	});

	let apiKey = $state('');
	let models = $state<string[]>([MODELS[0].id]);
	let size = $state(SIZES[0].id);
	let prompt = $state('');
	let referenceImages = $state<string[]>([]);

	const running = $derived(generations.running);
	const canGenerate = $derived(
		apiKey.trim().length > 0 && prompt.trim().length > 0 && models.length > 0
	);

	function generate() {
		if (!canGenerate || running) return;
		generations.run({ apiKey, models, prompt, size, referenceImages });
	}
</script>

<div class="min-h-screen bg-background">
	<Header />

	<main class="mx-auto max-w-2xl space-y-6 px-6 py-8">
		<ApiKey bind:apiKey />

		<div class="grid grid-cols-2 gap-4">
			<ModelSelect bind:models />
			<SizeSelect bind:size />
		</div>

		<ReferenceImages bind:images={referenceImages} />

		<Prompt bind:prompt onGenerate={generate} />

		{#if running}
			<Button
				onclick={() => generations.cancel()}
				variant="outline"
				class="w-full font-mono text-xs"
			>
				<LoaderIcon class="size-3.5 animate-spin" />
				cancel
			</Button>
		{:else}
			<Button onclick={generate} disabled={!canGenerate} class="w-full font-mono text-xs">
				generate{models.length > 1 ? ` ${models.length} images` : ''}
			</Button>
		{/if}

		<ResultsGrid />

		<HistoryGrid />
	</main>
</div>
