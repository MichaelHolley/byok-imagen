<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let {
		prompt = $bindable(),
		onGenerate
	}: { prompt: string; onGenerate: () => void } = $props();

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onGenerate();
	}
</script>

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
