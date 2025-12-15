<script>
	let { children } = $props()

	import { zoom } from 'd3-zoom'
	import { select } from 'd3-selection'
	import { onMount } from 'svelte'
	import { userState } from '$lib/state.svelte'

	let container
	let zoomBehavior

	$effect(() => {
		const zoom = userState.zoom
		console.log(zoom)
		if (!container || !zoomBehavior) return
		select(container).transition().duration(SNAP_DURATION).call(zoomBehavior.scaleTo, zoom)
	})

	let scale = $state(userState.zoom)

	const MIN_SCALE = 1
	const MAX_SCALE = 4
	const SNAP_DURATION = 300 // ms
	const SNAP_EPS = 0.01

	onMount(() => {
		const selection = select(container)
		zoomBehavior = zoom()
			.scaleExtent([MIN_SCALE, MAX_SCALE])
			.on('zoom', (event) => {
				scale = event.transform.k
			})
			.on('end', (event) => {
				// Only snap after user-initiated interaction (sourceEvent is set)
				if (!event.sourceEvent) return

				const current = event.transform.k
				const rounded = clamp(Math.round(current), MIN_SCALE, MAX_SCALE)

				userState.zoom = rounded
				// If already near an integer, do nothing
				// if (Math.abs(rounded - current) <= SNAP_EPS) return

				// select(container)
				// 	.transition()
				// 	.duration(SNAP_DURATION)
				// 	.call(zoomBehavior.scaleTo)
			})
			.filter(({ type, ctrlKey, shiftKey, altKey, touches }) => {
				switch (type) {
					case 'wheel':
						return ctrlKey || shiftKey || altKey
					case 'touchmove':
					case 'touchstart':
						return touches && touches.length === 2
				}
			})

		selection.call(zoomBehavior)

		return () => {
			selection.on('.zoom', null)
		}
	})

	function clamp(v, a, b) {
		return Math.max(a, Math.min(b, v))
	}

	function setScale(e) {
		const newScale = +e.target.value
		scale = newScale

		// Immediately set zoom to the selected value while dragging
		if (zoomBehavior && container) {
			select(container).call(zoomBehavior.scaleTo, clamp(newScale, MIN_SCALE, MAX_SCALE))
		}
	}

	function snapScale() {
		// Snap to nearest integer when slider is released
		const rounded = clamp(Math.round(scale), MIN_SCALE, MAX_SCALE)
		userState.zoom = rounded

		// if (Math.abs(rounded - scale) <= SNAP_EPS) return

		// select(container)
		// 	.transition()
		// 	.duration(SNAP_DURATION)
		// 	.call(zoomBehavior.scaleTo, clamp(rounded, MIN_SCALE, MAX_SCALE))
	}
</script>

<!-- <input
	type="range"
	min={MIN_SCALE}
	max={MAX_SCALE}
	value={scale}
	step="0.01"
	oninput={setScale}
	onchange={snapScale}
/> -->
<div bind:this={container} class="zoom wrapper">
	{@render children?.(scale)}
</div>
