<script>
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Select from '$lib/components/Select.svelte'

	let { children } = $props()

	let projects = $derived(
		$page.data.projects.map(({ name: value, name: label }) => ({ value, label }))
	)

	let selectedProject = $derived(
		projects.find(({ label }) => label === $page.data.project.name).value
	)

	function selectProject(e) {
		goto(selectedProject)
		console.log('select', e)
	}

	let svgWidth = $state()
	let margin = $derived($page.data.margin)

	let chartWidth = $derived(svgWidth - margin.left - margin.right)
	let columnWidth = $derived(chartWidth / 24)

	let columns = $derived(
		Array.from({ length: 25 }, (_, i) => ({
			x: i * columnWidth
		}))
	)
	// $effect(() => goto(selectedProject))
</script>

<div>
	<nav class="w-full bg-slate-800 text-white sticky top-0">
		<Select options={projects} bind:value={selectedProject} on:change={selectProject} />

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<svg width="100%" bind:clientWidth={svgWidth} height="50" role="img" class="axis">
			{#if svgWidth}
				<g transform="translate({margin.left}, 0)">
					{#each columns as column, i}}
						<line
							x1={column.x}
							x2={column.x}
							y1={i % 4 === 0 ? 38 : 44}
							y2="50"
							stroke="currentColor"
							class="text-slate-300"
						></line>
						{#if i % 4 === 0}
							<text
								x={column.x}
								y="33"
								fill="var(--color-slate-300)"
								text-anchor="middle"
								class="text-xs"
							>
								{`${i}`.padStart(2, '0')}:00
							</text>
						{/if}
						<!-- {#if i < 24}
							<text
								x={column.x + columnWidth / 2}
								y="40"
								fill="var(--color-slate-300)"
								text-anchor="middle"
								class="text-xs"
							>
								{`${i}`.padStart(2, '0')}:00
							</text>
						{/if} -->
					{/each}
				</g>
			{/if}
		</svg>
	</nav>
	{@render children()}
</div>

<style>
	svg text {
		font-feature-settings: 'tnum', 'lnum';
	}
</style>
