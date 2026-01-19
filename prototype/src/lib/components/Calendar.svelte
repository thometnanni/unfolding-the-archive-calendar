<script>
	import { page } from '$app/stores'
	import { getColorFromFileType, isSameBin, lerp, timeBetween } from '$lib/helper'
	import { scaleLinear } from 'd3-scale'
	import { filesize } from 'filesize'
	import Between from './Between.svelte'
	import { writable } from 'svelte/store'
	import { userState } from '$lib/state.svelte'
	import { browser } from '$app/environment'
	import Inspector from './Inspector.svelte'
	import DateReveal from './DateReveal.svelte'

	let { zoom } = $props()
	let data = $derived($page.data.project)

	let svgWidth = $state()

	const strokeWidth = 1
	const itemGap = 2
	const itemHeight = 4

	const collapsedBinHeight = 50

	const margin = $derived($page.data.margin)

	let chartWidth = $derived(svgWidth - margin.left - margin.right)
	let columnWidth = $derived(chartWidth / 24)

	let columnInnerWidth = $derived(columnWidth - strokeWidth - itemGap * 2)

	const maxInactiveDays = 3

	let binConfig = $derived({
		all: { itemWidth: 8 },
		year: { itemWidth: 16, maxBetween: 1 },
		month: { maxBetween: 3 },
		day: { maxBetween: 3 }
	})
	let binning = $derived.by(() => ({
		current: Object.keys(binConfig)[Math.floor(zoom) - 1],
		next: Object.keys(binConfig)[Math.min(Math.floor(zoom), 3)],
		progress: zoom % 1
	}))

	let vis = $derived.by(() => {
		if (svgWidth == null) return
		const files = $page.data.project.files
		const items = []
		const bins = {
			all: [],
			year: [],
			month: [],
			day: []
		}

		let maxY = {
			all: 0,
			year: 0,
			month: 0,
			day: 0
		}

		files
			.filter((file) => {
				const allowFileName =
					!userState.fileName ||
					file.path.toLowerCase().indexOf(userState.fileName.toLowerCase()) !== -1
				const allowFileType = !userState.fileType || userState.fileType === (file.type ?? 'other')

				return allowFileName && allowFileType
			})
			.forEach((file, index) => {
				const itemBins = Object.entries(binConfig).map(
					([bin, { itemWidth: desiredItemWidth, maxBetween }]) => {
						let itemWidth = columnInnerWidth
						if (desiredItemWidth && desiredItemWidth < columnInnerWidth) {
							const itemsPerColumn = Math.floor(
								(columnInnerWidth + itemGap) / (desiredItemWidth + itemGap)
							)
							itemWidth = (columnInnerWidth + itemGap) / itemsPerColumn - itemGap
						}

						let x = 0
						let y = 0
						let localX = null

						const previousItem = items.findLast((i) => i.file.hour === file.hour)
						const sameBin = isSameBin(previousItem?.file.date, file.date, bin)

						if (sameBin) {
							localX = (previousItem.bins[bin].localX ?? itemGap) + itemWidth + itemGap
							const newLine = localX + itemWidth + itemGap > columnWidth
							if (newLine) localX = itemGap + strokeWidth / 2

							x = file.hour * columnWidth + localX
							y = newLine
								? previousItem.bins[bin].y + itemHeight + itemGap
								: previousItem.bins[bin].y
						} else {
							const between = timeBetween(items.at(-1)?.file.date, file.date)
							if (between?.[bin]) {
								if (maxBetween && between?.[bin] > maxBetween) {
									const y = maxY[bin] + itemHeight + strokeWidth + itemGap

									bins[bin].push(
										{
											y,
											between: between?.[bin]
										},
										{
											date: file.date,
											y: y + collapsedBinHeight
										}
									)
								} else {
									for (let i = 0; i < between?.[bin]; i++) {
										const previousBinY = bins[bin].at(-1)?.y ?? 0
										const previousItemY = maxY[bin] + itemHeight

										bins[bin].push({
											date: file.date,
											y: Math.max(previousBinY, previousItemY) + strokeWidth + itemGap
										})
									}
								}
							}

							x = file.hour * columnWidth + itemGap + strokeWidth / 2
							y = (bins[bin].at(-1)?.y ?? 0) + itemGap + strokeWidth
						}

						maxY[bin] = Math.max(maxY[bin], y)

						return [bin, { x, y, localX, width: itemWidth }]
					}
				)

				items.push({
					index,
					file,
					bins: Object.fromEntries(itemBins),
					color: $page.data.colors[file.type] ?? $page.data.colors.other
				})
			})
		return {
			items,
			bins,
			height: maxY
		}
	})

	let items = $derived(
		vis?.items.map((item) => {
			const x = lerp(item.bins[binning.current].x, item.bins[binning.next].x, binning.progress)
			const y = lerp(item.bins[binning.current].y, item.bins[binning.next].y, binning.progress)
			const width = lerp(
				item.bins[binning.current].width,
				item.bins[binning.next].width,
				binning.progress
			)
			return { ...item, x, y, width }
		})
	)

	let chartHeight = $derived(
		(vis ? lerp(vis.height[binning.current], vis.height[binning.next], binning.progress) : 0) +
			itemHeight +
			itemGap +
			strokeWidth +
			collapsedBinHeight * 0.75
	)
	let svgHeight = $derived(
		Math.max(
			margin.top + margin.bottom + chartHeight + collapsedBinHeight * 0.75,
			((browser && innerHeight) ?? 0) - userState.navHeight
		)
	)

	let columns = $derived(
		Array.from({ length: 25 }, (_, i) => ({
			x: i * columnWidth
		}))
	)

	const fileTypes = ['drawing', 'image', 'document', 'other']

	function clearFile() {
		userState.item = null
	}

	function isActive({ index, file }) {
		const activeItem = userState.item ?? userState.hover.item
		if (activeItem) return activeItem.index === index
		if (userState.hover.fileType) return (file.type ?? 'other') === userState.hover.fileType
		return true
	}

	let selectedY = $derived(userState.hover.item?.bins?.[binning.current].y)
</script>

<div class="calendar relative">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<svg
		width="100%"
		bind:clientWidth={svgWidth}
		height={svgHeight}
		onclick={() => clearFile(true)}
		role="img"
		class="visualisation"
	>
		{#if vis?.items?.length}
			<g transform="translate({margin.left}, {margin.top + collapsedBinHeight * 0.75})">
				{#if vis.bins[binning.current] && binning.current != 'all'}
					{#each [{ y: 0, date: items[0].file.birthtime }, ...vis.bins[binning.current]] as { y, between, date }, index}}
						{@const height =
							(vis.bins[binning.current][index]?.y ?? chartHeight - collapsedBinHeight * 0.75) - y}
						{@const active = selectedY > y && selectedY < y + height}
						{@const colBefore = vis.bins[binning.current][index - 2]?.between
							? collapsedBinHeight * 0.25
							: 0}
						{@const colAfter = vis.bins[binning.current][index]?.between
							? collapsedBinHeight * 0.25
							: 0}
						{#if date != null}
							<DateReveal
								width={chartWidth}
								{y}
								{height}
								{active}
								{date}
								binning={binning.current}
								{colBefore}
								{colAfter}
							></DateReveal>
						{/if}
					{/each}
				{/if}

				{#each items as item}
					{@const active = isActive(item)}
					<rect
						width={item.width}
						height={itemHeight}
						x={item.x}
						y={item.y}
						fill={item.color}
						opacity={active ? 1 : 0.37}
					></rect>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<rect
						width={item.width + itemGap * 2 + strokeWidth}
						height={itemHeight + itemGap}
						x={item.x - itemGap}
						y={item.y - itemGap / 2}
						fill="green"
						onmouseenter={() => (userState.hover.item = item)}
						onmouseleave={() => (userState.hover.item = null)}
						onclick={(e) => {
							if (userState.item) return
							e.stopPropagation()
							userState.item = item
						}}
						opacity="0"
						class:cursor-none={userState.item == null}
					></rect>
				{/each}

				<g>
					{#each columns as column}}
						<line
							x1={column.x}
							x2={column.x}
							y2={chartHeight}
							stroke="currentColor"
							class="text-slate-300 pointer-events-none"
						></line>
					{/each}
				</g>

				<Between
					{chartWidth}
					between="first file created {new Date(items[0].file.birthtime).toLocaleDateString()}"
					y={-collapsedBinHeight}
					{collapsedBinHeight}
					{strokeWidth}
					start
				/>
				{#if vis.bins[binning.current]}
					{#each vis.bins[binning.current] as { y, between }, index}}
						{@const height =
							(vis.bins[binning.current][index + 1]?.y ?? chartHeight - collapsedBinHeight * 0.75) -
							y}
						<line
							x2={chartWidth}
							y1={y}
							y2={y}
							stroke="currentColor"
							class="text-slate-300 pointer-events-none"
						></line>
						{#if between}
							<Between
								{chartWidth}
								between="{between} {binning.current}s"
								{y}
								{collapsedBinHeight}
								{strokeWidth}
							/>
						{/if}
					{/each}
				{/if}
				<Between
					{chartWidth}
					between="last file created {new Date(items.at(-1).file.birthtime).toLocaleDateString()}"
					y={chartHeight - collapsedBinHeight * 0.75}
					{collapsedBinHeight}
					{strokeWidth}
					end
				/>
			</g>
		{/if}
	</svg>
	{#if !vis?.items?.length}
		<div class="absolute top-6 w-full flex justify-center">
			<span class="px-8 py-1 bg-slate-100 border border-slate-300 text-xs text-slate-400"
				>no matching files</span
			>
		</div>
	{/if}
	<Inspector
		width={chartWidth}
		offset={{
			x: margin.left,
			y: margin.top + collapsedBinHeight * 0.75 + itemHeight / 2
		}}
	/>
</div>

<style>
	:global(html) {
		--grey-1: #d3d3d3;
		--grey-2: #929292;
		--grey-3: #f0f0f0;
		--highlight: rgb(254, 255, 190);
		/* font-size: 13px; */
	}
</style>
