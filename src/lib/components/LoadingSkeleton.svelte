<script lang="ts">
	import LoaderIcon from '@lucide/svelte/icons/loader';

	let { size }: { size: string } = $props();
</script>

<div class="border border-border">
	<div
		class="flex items-center justify-center bg-muted"
		style="aspect-ratio: {size.replace(':', '/')};"
	>
		<LoaderIcon class="size-6 animate-spin text-muted-foreground" />
	</div>
</div>
