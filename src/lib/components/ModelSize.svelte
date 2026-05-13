<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select/index.js';

	type Model = { id: string; name: string; note: string };
	type Size = { id: string; note: string };

	let {
		model = $bindable(),
		size = $bindable(),
		models,
		sizes
	}: { model: string; size: string; models: Model[]; sizes: Size[] } = $props();

	const selectedModel = $derived(models.find((m) => m.id === model));
	const selectedSize = $derived(sizes.find((s) => s.id === size));
</script>

<div class="grid grid-cols-2 gap-4">
	<div class="space-y-2">
		<Label class="font-mono text-xs">Model</Label>
		<Select type="single" bind:value={model}>
			<SelectTrigger class="w-full font-mono text-xs">
				{selectedModel?.name ?? 'Select model'}
			</SelectTrigger>
			<SelectContent>
				{#each models as m (m.id)}
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
				{#each sizes as s (s.id)}
					<SelectItem value={s.id} class="font-mono text-xs">
						<span>{s.note}</span>
						<span class="ml-auto pl-4 text-muted-foreground">{s.id}</span>
					</SelectItem>
				{/each}
			</SelectContent>
		</Select>
	</div>
</div>
