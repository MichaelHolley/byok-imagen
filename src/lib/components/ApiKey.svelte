<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';

	let { apiKey = $bindable() }: { apiKey: string } = $props();
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<Label for="api-key" class="font-mono text-xs">OpenRouter API Key</Label>
		<Badge variant="secondary" class="gap-1 font-mono text-xs">
			<EyeOffIcon class="size-3" />
			session only · never stored
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
	<p class="font-mono text-xs text-muted-foreground">
		Key lives in browser memory only. Check Network tab — all requests go to
		<span class="text-foreground">openrouter.ai</span>, not this domain.
	</p>
</div>
