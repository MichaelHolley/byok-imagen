<script lang="ts">
	let { error }: { error: string } = $props();
</script>

<div class="border border-destructive/40 bg-destructive/5 p-3">
	<p class="font-mono text-xs text-destructive">{error}</p>
</div>
