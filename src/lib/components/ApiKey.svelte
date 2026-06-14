<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import DatabaseIcon from '@lucide/svelte/icons/database';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'openrouter-api-key';

	let { apiKey = $bindable() }: { apiKey: string } = $props();

	let storeKey = $state(false);

	onMount(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			apiKey = stored;
			storeKey = true;
		}
	});

	$effect(() => {
		if (storeKey) {
			localStorage.setItem(STORAGE_KEY, apiKey);
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	});
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<Label for="api-key" class="font-mono text-xs">OpenRouter API Key</Label>
		<Badge variant="secondary" class="gap-1 font-mono text-xs">
			{#if storeKey}
				<DatabaseIcon class="size-3" />
				saved to localStorage
			{:else}
				<EyeOffIcon class="size-3" />
				session only · never stored
			{/if}
		</Badge>
	</div>
	<Input
		id="api-key"
		type="password"
		placeholder="sk-or-v1-..."
		bind:value={apiKey}
		class="font-mono text-xs"
		autocomplete="off"
	/>
	<div class="flex items-center justify-between gap-4">
		<p class="font-mono text-xs text-muted-foreground">
			{#if storeKey}
				Key is saved to browser localStorage and restored on next visit.
			{:else}
				Key lives in browser memory only. Check Network tab — all requests go to
				<span class="text-foreground">openrouter.ai</span>, not this domain.
			{/if}
		</p>
		<div class="flex shrink-0 items-center gap-1.5">
			<Label class="cursor-pointer font-mono text-xs text-muted-foreground">Remember</Label>
			<Switch bind:checked={storeKey} />
		</div>
	</div>
</div>
