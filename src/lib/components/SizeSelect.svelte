<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select/index.js';
	import { SIZES } from '$lib/models.js';

	let { size = $bindable() }: { size: string } = $props();

	const selected = $derived(SIZES.find((s) => s.id === size));
</script>

<div class="space-y-2">
	<Label for="aspect-ratio" class="font-mono text-xs">Aspect ratio</Label>
	<Select type="single" bind:value={size}>
		<SelectTrigger
			id="aspect-ratio"
			aria-describedby={size === 'auto' ? 'aspect-ratio-help' : undefined}
			class="w-full font-mono text-xs"
		>
			{selected?.note ?? 'Select aspect ratio'}
		</SelectTrigger>
		<SelectContent>
			{#each SIZES as s (s.id)}
				<SelectItem value={s.id} class="font-mono text-xs">
					<span>{s.note}</span>
					<span class="ml-auto pl-4 text-muted-foreground">
						{s.id === 'auto' ? 'model default' : s.id}
					</span>
				</SelectItem>
			{/each}
		</SelectContent>
	</Select>
	{#if size === 'auto'}
		<p id="aspect-ratio-help" class="font-mono text-xs text-muted-foreground">
			No ratio is forced. Keeping a reference image's ratio depends on the model.
		</p>
	{/if}
</div>
