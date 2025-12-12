<script>
	import { page } from '$app/stores'
	import { getColorFromFileType, isSameBin, lerp, timeBetween } from '$lib/helper'
	import { scaleLinear } from 'd3-scale'
	import { filesize } from 'filesize'
	import Between from './Between.svelte'
	// import Select from './Select.svelte'

	let { zoom } = $props()
	let data = $derived($page.data.project)

	// const projects = [
	// 	{ value: 'apple', label: 'Apple' },
	// 	{ value: 'banana', label: 'Banana' },
	// 	{ value: 'cherry', label: 'Cherry' },
	// 	{ value: 'date', label: 'Date' }
	// ]

	// let selectedProject = $state(null)

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

		files.forEach((file, index) => {
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
						y = newLine ? previousItem.bins[bin].y + itemHeight + itemGap : previousItem.bins[bin].y
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
										y: y + collapsedBinHeight
									}
								)
							} else {
								for (let i = 0; i < between?.[bin]; i++) {
									const previousBinY = bins[bin].at(-1)?.y ?? 0
									const previousItemY = maxY[bin] + itemHeight

									bins[bin].push({
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
				file,
				bins: Object.fromEntries(itemBins),
				color: getColorFromFileType(file.type)
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
			collapsedBinHeight * 1.5
	)
	let svgHeight = $derived(margin.top + margin.bottom + chartHeight)

	let columns = $derived(
		Array.from({ length: 25 }, (_, i) => ({
			x: i * columnWidth
		}))
	)

	// const xBinSize = 1

	// let axisHeight = 16

	// const itemHeight = 1
	// const itemGap = 2

	// const days = $derived(files.map(({ day }) => day))
	// const minDay = $derived(Math.min(...days))
	// const maxDay = $derived(Math.max(...days))
	// const diffDay = $derived(maxDay - minDay)

	// let innerChartWidth = $derived(Math.max(svgWidth - paddingLeft - paddingRight, 0))

	// let binWidth = $derived(innerChartWidth / (24 / xBinSize) - 1 - itemGap * 2)

	// const scaleX = $derived(
	//   scaleLinear().domain([0, 24]).range([0, innerChartWidth])
	// )

	// let yBins = $derived(
	//   '-'
	//     .repeat(diffDay)
	//     .split('-')
	//     .map((_, tick) => {
	//       const day = tick + minDay
	//       const date = new Date(day * 1000 * 60 * 60 * 24)
	//       const isFirstOfYear = date.getMonth() === 0 && date.getDate() === 1
	//       const isFirstOfMonth = date.getDate() === 1
	//       const isFirstOfWeek = date.getDay() === 1
	//       const month =
	//         isFirstOfMonth &&
	//         (() => {
	//           const match = date.toDateString().match(/(...)\s[0-9]{2}\s[0-9]{4}/)
	//           return match && match[1]
	//         })()
	//       const year = `${date.getFullYear()}`.slice(2)
	//       const label = isFirstOfMonth && `${month} ${isFirstOfYear ? year : ''}`
	//       // const x = scaleX(tick + minDay)

	//       let xBins = {}
	//       // const yBinCount = 24 / yBinSize
	//       files
	//         .filter((file) => day === file.day)
	//         .forEach((file) => {
	//           const xBin = Math.floor(file.hours / xBinSize)
	//           // if (yBins == null) yBins = {}
	//           if (xBins[xBin] == null) xBins[xBin] = []
	//           xBins[xBin].push(file)
	//         })

	//       const xBinsTidy = Object.entries(xBins).map(([xBin, files]) => ({
	//         xBin,
	//         x: scaleX(+xBin * xBinSize),
	//         files: files.sort((a, b) => a.birthtime - b.birthtime)
	//         // .sort(
	//         //   (a, b) => fileTypes.indexOf(a.type) - fileTypes.indexOf(b.type)
	//         // )
	//       }))

	//       const maxFiles = Math.max(
	//         ...xBinsTidy.map(({ files }) => files.length),
	//         0
	//       )

	//       return {
	//         xBins: xBinsTidy,
	//         maxFiles,
	//         date,
	//         scale: {
	//           value: tick,
	//           label,
	//           opacity: isFirstOfWeek ? 0.05 : 0.05
	//           // x
	//         },
	//         tick,
	//         isFirst: day === minDay,
	//         isLast: day === maxDay
	//       }
	//     })
	//     .map((yBin, i, yBins) => {
	//       const remainingBins = yBins.slice(i + 1)
	//       const next = remainingBins.findIndex(({ xBins }) => xBins.length > 0)

	//       return {
	//         next,
	//         nextDate: remainingBins[next]?.date,
	//         ...yBin
	//       }
	//     })
	//     .filter(({ next, xBins }, i, yBins) => {
	//       if (xBins.length > 0) return true

	//       const before = yBins
	//         .slice(i - maxInactiveDays - 1, i)
	//         .map(({ next }) => next)
	//       const after = yBins
	//         .slice(i, i + maxInactiveDays)
	//         .map(({ next }) => next)

	//       if (
	//         i === yBins.length - 1 ||
	//         (before.includes(0) &&
	//           after.includes(0) &&
	//           !before.includes(maxInactiveDays + 1))
	//       )
	//         return true
	//     })
	//     .map((yBin) => {
	//       const height =
	//         Math.max(yBin.maxFiles, 1) * (itemGap + itemHeight) + 1 + itemGap
	//       const fullHeight = height + (yBin.next > maxInactiveDays ? 40 : 0)
	//       return { ...yBin, height, fullHeight }
	//     })
	//     .map((yBin, i, yBins) => {
	//       const before = yBins.slice(0, i)

	//       const y = before.reduce((prev, curr) => prev + curr.fullHeight, 0)
	//       return { ...yBin, y }
	//     })
	// )

	// const firstInactivePeriod = $derived(
	//   yBins.findIndex(({ next }) => next > maxInactiveDays)
	// )

	const fileTypes = ['drawing', 'image', 'document', 'other']

	// let innerSvgHeight = $derived(
	//   yBins[yBins.length - 1].y + yBins[yBins.length - 1].height
	// )

	// let svgHeight = $derived(
	//   innerSvgHeight + paddingTop + paddingBottom + axisHeight
	// )

	// const labeledTicks = [4, 8, 12, 16, 20]
	// let xTicks = $derived(
	//   '-'
	//     .repeat(24)
	//     .split('-')
	//     .map((_, tick) => {
	//       const x = scaleX(tick)
	//       return {
	//         value: tick,
	//         showLabel: labeledTicks.includes(tick),
	//         x
	//       }
	//     })
	// )

	// function formatHour(hour) {
	//   return `${hour < 10 ? '0' : ''}${hour.toFixed()}:00`
	// }

	// function formatDays(d) {
	//   return `${d} days`
	// }

	// let selectedFile= $state(null)
	// let selectedFileLocked = $state(false)
	// function inspectFile(file, lock) {
	//   if (selectedFileLocked && !lock) return
	//   selectedFile = file
	//   if (lock) {
	//     selectedFileLocked = true
	//   }
	// }
	// function clearFile(removeLock) {
	//   if (selectedFileLocked && !removeLock) return
	//   selectedFileLocked = false
	//   selectedFile = null
	// }
</script>

<div class="calendar">
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
		{#if vis}
			<g transform="translate({margin.left}, {margin.top + collapsedBinHeight * 0.75})">
				{#each items as item}
					<rect width={item.width} height={itemHeight} x={item.x} y={item.y} fill={item.color}
					></rect>
				{/each}

				<g>
					{#each columns as column}}
						<line
							x1={column.x}
							x2={column.x}
							y2={chartHeight}
							stroke="currentColor"
							class="text-slate-300"
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
				<!-- <line x2={chartWidth} y1={0} y2={0} stroke="currentColor" class="text-slate-300"></line> -->
				{#if vis.bins[binning.current]}
					{#each vis.bins[binning.current] as { y, between }}}
						<line x2={chartWidth} y1={y} y2={y} stroke="currentColor" class="text-slate-300"></line>
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
