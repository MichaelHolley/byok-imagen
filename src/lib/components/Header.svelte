<script lang="ts">
	import ImageIcon from '@lucide/svelte/icons/image';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
</script>

<header class="border-b border-border/60 px-6 py-4">
	<div class="mx-auto flex max-w-2xl items-center justify-between">
		<div class="flex items-center gap-2">
			<ImageIcon class="size-5 text-primary" />
			<span class="font-mono text-sm font-semibold tracking-tight text-foreground">byok imagen</span>
		</div>
		<div class="flex items-center gap-1.5">
			<ShieldCheckIcon class="size-3.5 text-muted-foreground" />
			<span class="font-mono text-xs text-muted-foreground">client-side only</span>
		</div>
	</div>
</header>
