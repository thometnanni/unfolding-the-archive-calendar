<script>
	let { children } = $props();

	import { zoom } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { onMount } from 'svelte';

	let container;

	let scale = $state(1);

	onMount(() => {
		const selection = select(container);

		selection.call(
			zoom()
				.scaleExtent([1, 3])
				.on('zoom', (event) => {
					console.log(event)
					scale = event.transform.k;
				})
				.filter(({ type, ctrlKey, shiftKey, altKey, touches }) => {
					switch (type) {
						case 'wheel':
							return ctrlKey || shiftKey || altKey;
						case 'touchmove':
						case 'touchstart':
							return event.touches.length === 2;
					}
				})
		);

		return () => {
			selection.on('.zoom', null);
		};
	});
</script>

<div bind:this={container} class="zoom wrapper">
	{@render children?.(scale)}
</div>
