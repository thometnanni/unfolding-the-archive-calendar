<script>
	import { page } from '$app/stores'
	import { userState } from '$lib/state.svelte'
	import { filesize } from 'filesize'

	let { width, offset = { x: 0, y: 0 } } = $props()

	let item = $derived(userState.item || userState.hover.item)

	let x = $derived(
		Math.min(Math.max(item?.x + offset.x + item?.width / 2, 150), width - 150 + offset.x * 2)
	)
	let y = $derived(item?.y + offset.y)
	let date = $derived(item && new Date(item.file.birthtime))
</script>

{#if item != null}
	<div
		class="top-0 absolute flex items-center justify-center pointer-events-none"
		style="transform: translate({x}px, {y}px);"
	>
		<div class="absolute flex flex-col bottom-4 gap-2 justify-center items-center">
			{#if item.y > 40}
				<div
					class="info px-2 py-1 whitespace-nowrap right-2 text-xs -ml-20"
					class:pointer-events-auto={userState.item}
				>
					{date.toLocaleDateString()}
				</div>
			{/if}
			<div
				class="info px-4 py-2 whitespace-nowrap bottom-5 flex items-center flex-col max-w-[300px] rounded-full!"
				class:pointer-events-auto={userState.item}
			>
				<span
					class="text-xs text-ellipsis overflow-hidden max-w-[calc(300px-var(--spacing)*8)]"
					style="direction: rtl;"
				>
					{item.file.path.replace(/(\/|^)[^\/]+$/, '')}
				</span>
				<span class="text-slate-800">{item.file.name}</span>
			</div>
		</div>
		<div class="absolute flex flex-col top-2 gap-1 justify-center items-center">
			{#if item.y <= 40}
				<div
					class="info px-2 py-1 whitespace-nowrap right-2 text-xs -ml-20"
					class:pointer-events-auto={userState.item}
				>
					{date.toLocaleDateString()}
				</div>
			{/if}
			<div
				class="info px-2 py-1 whitespace-nowrap ml-24 text-xs -mt-1"
				class:pointer-events-auto={userState.item}
			>
				{date.toTimeString().slice(0, 5)}
			</div>
			<div
				class="info px-2 py-1 whitespace-nowrap right-5 top-1 text-xs -ml-20 poi"
				class:pointer-events-auto={userState.item}
			>
				{filesize(item.file.fileSize)}
			</div>

			{#if item.file.layers}
				<div class="info px-2 py-1 whitespace-nowrap right-5 top-1 text-xs">
					{item.file.layers.length} layers
				</div>

				{#if userState.item}
					<div class="info px-2 py-1 right-5 top-1 text-xs w-[300px] text-center">
						<!-- {#each item.file.layers as layer}
							<span>{layer}</span>
						{/each} -->
						{item.file.layers.toSorted().join(', ')}
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style>
	@reference '../../routes/layout.css';
	.info {
		font-feature-settings: 'tnum', 'lnum';
		@apply rounded-xl bg-indigo-400/10 text-slate-600 backdrop-blur-xs;
	}
</style>
