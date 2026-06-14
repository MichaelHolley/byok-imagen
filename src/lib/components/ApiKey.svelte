<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
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
			<Label for="store-key" class="cursor-pointer font-mono text-xs text-muted-foreground"
				>Remember</Label
			>
			<button
				id="store-key"
				role="switch"
				aria-checked={storeKey}
				onclick={() => (storeKey = !storeKey)}
				class="focus-visible:ring-ring focus-visible:ring-offset-background relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 {storeKey
					? 'bg-primary'
					: 'bg-input'}"
			>
				<span
					class="bg-background pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform {storeKey
						? 'translate-x-4'
						: 'translate-x-0'}"
				></span>
			</button>
		</div>
	</div>
</div>
