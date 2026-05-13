<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';

	let {
		imageUrl,
		generationCost,
		prompt,
		onDownload
	}: { imageUrl: string; generationCost: number | null; prompt: string; onDownload: () => void } =
		$props();
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<Label class="font-mono text-xs">Output</Label>
			{#if generationCost !== null}
				<Badge variant="secondary" class="font-mono text-xs">
					${generationCost.toFixed(4)}
				</Badge>
			{/if}
		</div>
		<Button variant="ghost" size="sm" onclick={onDownload} class="h-7 gap-1 font-mono text-xs">
			<DownloadIcon class="size-3" />
			download
		</Button>
	</div>
	<div class="border border-border">
		<img src={imageUrl} alt={prompt} class="w-full" />
	</div>
</div>
