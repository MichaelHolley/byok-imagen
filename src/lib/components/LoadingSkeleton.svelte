<script lang="ts">
	import LoaderIcon from '@lucide/svelte/icons/loader';

	let { size, modelName }: { size: string; modelName: string } = $props();
</script>

<div class="border border-border">
	<div
		class="flex items-center justify-center bg-muted"
		style="aspect-ratio: {size.replace(':', '/')};"
	>
		<div class="flex flex-col items-center gap-2">
			<LoaderIcon class="size-6 animate-spin text-muted-foreground" />
			<span class="font-mono text-xs text-muted-foreground">generating with {modelName}...</span>
		</div>
	</div>
</div>
