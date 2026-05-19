<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import ImagePlusIcon from '@lucide/svelte/icons/image-plus';
	import XIcon from '@lucide/svelte/icons/x';

	let { images = $bindable<string[]>([]) }: { images: string[] } = $props();

	let fileInput: HTMLInputElement;
	let dragOver = $state(false);

	const MAX_FILES = 4;
	const MAX_BYTES = 8 * 1024 * 1024;
	const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

	function readAsDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(file);
		});
	}

	async function addFiles(files: FileList | File[]) {
		const accepted: File[] = [];
		for (const f of Array.from(files)) {
			if (!ACCEPTED.includes(f.type)) continue;
			if (f.size > MAX_BYTES) continue;
			accepted.push(f);
		}
		const slots = MAX_FILES - images.length;
		const next = await Promise.all(accepted.slice(0, slots).map(readAsDataUrl));
		images = [...images, ...next];
	}

	function onPick(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		if (input.files) addFiles(input.files);
		input.value = '';
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
	}

	function remove(i: number) {
		images = images.filter((_, idx) => idx !== i);
	}
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<Label class="font-mono text-xs">Reference images</Label>
		<span class="font-mono text-xs text-muted-foreground">{images.length}/{MAX_FILES}</span>
	</div>

	<div
		role="button"
		tabindex="0"
		onclick={() => fileInput.click()}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.click()}
		ondragover={(e) => {
			e.preventDefault();
			dragOver = true;
		}}
		ondragleave={() => (dragOver = false)}
		ondrop={onDrop}
		class="cursor-pointer border border-dashed border-border p-3 transition-colors hover:bg-muted/40 {dragOver
			? 'bg-muted/60'
			: ''}"
	>
		{#if images.length === 0}
			<div class="flex items-center justify-center gap-2 py-4 text-muted-foreground">
				<ImagePlusIcon class="size-4" />
				<span class="font-mono text-xs">drop images or click to upload</span>
			</div>
		{:else}
			<div class="grid grid-cols-4 gap-2">
				{#each images as src, i (src)}
					<div class="group relative aspect-square overflow-hidden border border-border">
						<img {src} alt="reference {i + 1}" class="size-full object-cover" />
						<button
							type="button"
							onclick={(e) => {
								e.stopPropagation();
								remove(i);
							}}
							class="absolute right-1 top-1 flex size-5 items-center justify-center bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
							aria-label="Remove"
						>
							<XIcon class="size-3" />
						</button>
					</div>
				{/each}
				{#if images.length < MAX_FILES}
					<Button
						type="button"
						variant="ghost"
						onclick={(e) => {
							e.stopPropagation();
							fileInput.click();
						}}
						class="flex aspect-square size-auto items-center justify-center border border-dashed border-border"
					>
						<ImagePlusIcon class="size-4 text-muted-foreground" />
					</Button>
				{/if}
			</div>
		{/if}
	</div>

	<p class="font-mono text-xs text-muted-foreground">
		png · jpeg · webp · gif · max {MAX_FILES} · 8MB each
	</p>

	<input
		bind:this={fileInput}
		type="file"
		accept="image/png,image/jpeg,image/webp,image/gif"
		multiple
		onchange={onPick}
		class="hidden"
	/>
</div>
