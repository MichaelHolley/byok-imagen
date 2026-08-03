<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import ResultCard from '$lib/components/ResultCard.svelte';
	import { generations } from '$lib/generations.svelte.js';
	import XIcon from '@lucide/svelte/icons/x';

	const jobs = $derived(generations.jobs);
	const totalCost = $derived(generations.totalCost);
</script>

{#if jobs.length > 0}
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Label class="font-mono text-xs">Output</Label>
				{#if jobs.length > 1 && totalCost !== null}
					<Badge variant="secondary" class="font-mono text-xs">
						${totalCost.toFixed(4)} total
					</Badge>
				{/if}
			</div>
			{#if !generations.running}
				<Button
					variant="ghost"
					size="sm"
					onclick={() => generations.clear()}
					class="h-7 gap-1 font-mono text-xs text-muted-foreground"
				>
					<XIcon class="size-3" />
					dismiss
				</Button>
			{/if}
		</div>

		<div class="grid gap-4 {jobs.length > 1 ? 'sm:grid-cols-2' : ''}">
			{#each jobs as job (job.id)}
				<ResultCard {job} />
			{/each}
		</div>
	</div>
{/if}
