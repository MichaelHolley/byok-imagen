<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select/index.js';
	import { MODELS } from '$lib/models.js';

	let { models = $bindable() }: { models: string[] } = $props();

	const label = $derived(
		models.length === 0
			? 'Select models'
			: models.length === 1
				? (MODELS.find((m) => m.id === models[0])?.name ?? models[0])
				: `${models.length} models`
	);
</script>

<div class="space-y-2">
	<Label class="font-mono text-xs">Models</Label>
	<Select type="multiple" bind:value={models}>
		<SelectTrigger class="w-full font-mono text-xs">
			{label}
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
