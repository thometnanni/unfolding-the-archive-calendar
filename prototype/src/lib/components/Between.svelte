<script>
	let { between, chartWidth, y, collapsedBinHeight, strokeWidth, start, end } = $props()

	const narrowing = 0.85
	const narrowingOffset = (1 - narrowing) / 2

	let path = $derived.by(() => {
		const columnWidth = chartWidth / 24

		const h = collapsedBinHeight / 4

		const points = [
			!start && [0, 0],
			!start && [chartWidth, 0],
			[chartWidth * (narrowing + narrowingOffset), h],
			[chartWidth * (narrowing + narrowingOffset), h * 3],
			!end && [chartWidth, h * 4],
			!end && [0, h * 4],
			[chartWidth * narrowingOffset, h * 3],
			[chartWidth * narrowingOffset, h],
			!start && [0, 0]
		]
			.filter((d) => d)
			.map((p) => p.join(','))

		return `M${points.join('L')}`

		// return Array.from({ length: 25 }, (_, i) => {
		// 	if (i !== 0 && i !== 24) return ''
		// 	const x1 = i * columnWidth
		// 	const x2 = i * columnWidth * narrowing + chartWidth * narrowingOffset

		// 	const y = collapsedBinHeight / 3

		// 	const p = [x1, x2, x2, x1].map((x, i) => `${x},${y * i}`)

		// 	const path = `M${p[0]}L${p[1]}M${p[2]}L${p[3]}`

		// 	return path
		// }).join('')
	})
</script>

<rect
	height={collapsedBinHeight - strokeWidth}
	width={chartWidth + strokeWidth}
	x={-strokeWidth / 2}
	y={y + strokeWidth / 2}
	fill="currentColor"
	class="text-white"
>
</rect>

<g transform="translate(0, {y})">
	<!-- {#each columns as column} -->
	<path d={path} stroke="currentColor" fill="var(--color-slate-50)" class="text-slate-300"></path>
	<!-- {/each} -->

	<rect
		height={collapsedBinHeight * 0.5}
		width={narrowing * chartWidth}
		x={narrowingOffset * chartWidth}
		y={collapsedBinHeight / 4}
		stroke="currentColor"
		x-fill="none"
		fill="var(--color-slate-100)"
		class="text-slate-300"
	>
	</rect>

	<text
		y={collapsedBinHeight / 2}
		x={chartWidth / 2}
		text-anchor="middle"
		dominant-baseline="central"
		fill="currentColor"
		class="text-slate-400 text-xs">{between}</text
	>
</g>
