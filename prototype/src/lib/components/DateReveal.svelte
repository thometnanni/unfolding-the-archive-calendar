<script>
	let { width, y, height, active: activeItem, date, binning, colBefore, colAfter } = $props()

	let activeRow = $state(false)

	let active = $derived(activeItem || activeRow)

	let formattedDate = $derived.by(() => {
		switch (binning) {
			case 'all':
				return ''
			case 'year':
				return new Date(date).getFullYear()
			case 'month':
				return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit' })
			default:
				return new Date(date).toLocaleDateString()
		}
	})
</script>

<g>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<rect
		class="text-transparent"
		fill="currentColor"
		class:text-slate-50={active}
		{width}
		y={y - colBefore}
		height={height + colBefore + colAfter}
		onmouseenter={() => (activeRow = true)}
		onmouseleave={() => (activeRow = false)}
	></rect>
	{#if active}
		<text
			transform="translate(-8 {y + height / 2}) rotate(-90)"
			text-anchor="middle"
			fill="currentColor"
			class="text-slate-400 text-xs">{formattedDate}</text
		>
		<text
			transform="translate({width + 8} {y + height / 2}) rotate(90)"
			text-anchor="middle"
			fill="currentColor"
			class="text-slate-400 text-xs">{formattedDate}</text
		>
	{/if}
</g>

<style>
	text {
		font-feature-settings: 'tnum', 'lnum';
	}
</style>
