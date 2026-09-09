<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import { downloadImage } from '$lib/download.js';
	import type { Job } from '$lib/generations.svelte.js';
	import DownloadIcon from '@lucide/svelte/icons/download';

	let { job }: { job: Job } = $props();
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between gap-2">
		<div class="flex min-w-0 items-center gap-2">
			<span class="truncate font-mono text-xs">{job.modelName}</span>
			{#if job.cost !== null}
				<Badge variant="secondary" class="shrink-0 font-mono text-xs">
					${job.cost.toFixed(4)}
				</Badge>
			{/if}
		</div>
		{#if job.status === 'success' && job.imageUrl}
			<Button
				variant="ghost"
				size="sm"
				onclick={() => downloadImage(job.imageUrl!, `imagen-${job.id}.png`)}
				class="h-7 shrink-0 gap-1 font-mono text-xs"
			>
				<DownloadIcon class="size-3" />
				download
			</Button>
		{/if}
	</div>

	{#if job.status === 'loading'}
		<LoadingSkeleton size={job.size} />
	{:else if job.status === 'error'}
		<div
			class="flex items-center justify-center border border-destructive/40 bg-destructive/5 p-3"
			style="aspect-ratio: {job.size.replace(':', '/')};"
		>
			<p class="text-center font-mono text-xs text-destructive">{job.error}</p>
		</div>
	{:else if job.imageUrl}
		<div class="border border-border">
			<img src={job.imageUrl} alt={job.prompt} class="w-full" />
		</div>
		{#if !job.sizeHonoured}
			<p class="font-mono text-xs text-muted-foreground">
				{job.size} unsupported &rarr; model default
			</p>
		{/if}
	{/if}
</div>
