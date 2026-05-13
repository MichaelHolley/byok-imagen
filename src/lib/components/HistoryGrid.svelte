<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { history, type GenerationResult } from '$lib/history.svelte.js';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import TrashIcon from '@lucide/svelte/icons/trash-2';

	function download(item: GenerationResult) {
		const a = document.createElement('a');
		a.href = item.imageUrl;
		a.download = `imagen-${item.timestamp}.png`;
		a.click();
	}
</script>

{#if history.items.length > 0}
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<span class="font-mono text-xs text-muted-foreground">history ({history.items.length})</span>
			<Button
				variant="ghost"
				size="sm"
				onclick={() => history.clear()}
				class="h-7 gap-1 font-mono text-xs text-muted-foreground"
			>
				<TrashIcon class="size-3" />
				clear all
			</Button>
		</div>

		<div class="grid grid-cols-3 gap-3">
			{#each history.items as item (item.id)}
				<div class="group relative overflow-hidden border border-border">
					<img src={item.imageUrl} alt={item.prompt} class="w-full object-cover" />

					<div
						class="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<p class="line-clamp-3 font-mono text-xs text-white">{item.prompt}</p>

						<div class="flex items-center justify-between">
							<div class="flex flex-col gap-0.5">
								<span class="font-mono text-[10px] text-white/60">{item.modelName}</span>
								{#if item.cost !== null}
									<Badge variant="secondary" class="w-fit font-mono text-[10px]">
										${item.cost.toFixed(4)}
									</Badge>
								{/if}
							</div>
							<div class="flex gap-1">
								<button
									onclick={() => download(item)}
									class="flex size-6 items-center justify-center text-white/80 hover:text-white"
									aria-label="Download"
								>
									<DownloadIcon class="size-3.5" />
								</button>
								<button
									onclick={() => history.remove(item.id)}
									class="flex size-6 items-center justify-center text-white/80 hover:text-white"
									aria-label="Delete"
								>
									<TrashIcon class="size-3.5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
