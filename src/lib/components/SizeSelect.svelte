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
	<Label class="font-mono text-xs">Size</Label>
	<Select type="single" bind:value={size}>
		<SelectTrigger class="w-full font-mono text-xs">
			{selected?.note ?? 'Select size'}
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
