<script>
	import { page } from '$app/stores'
	let svgWidth = $state()
	let margin = $derived($page.data.margin)

	let chartWidth = $derived(svgWidth - margin.left - margin.right)
	let columnWidth = $derived(chartWidth / 24)

	let columns = $derived(
		Array.from({ length: 25 }, (_, i) => ({
			x: i * columnWidth
		}))
	)
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<svg
	width="100%"
	bind:clientWidth={svgWidth}
	height="25"
	role="img"
	class="sticky left-0 mt-2 xs:mt-4"
>
	{#if svgWidth}
		<g transform="translate({margin.left}, 0)">
			{#each columns as column, i}}
				<line
					x1={column.x}
					x2={column.x}
					y1={i % 4 === 0 ? 13 : 19}
					y2="25"
					stroke="currentColor"
					class="text-slate-300"
				></line>
				{#if i % 4 === 0}
					<text
						x={column.x}
						y="8"
						fill="var(--color-slate-300)"
						text-anchor="middle"
						class="text-xs"
					>
						{`${i}`.padStart(2, '0')}:00
					</text>
				{/if}
			{/each}
		</g>
	{/if}
</svg>

<style>
	svg text {
		font-feature-settings: 'tnum', 'lnum';
	}
</style>
