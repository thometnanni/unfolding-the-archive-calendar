<script>
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Radio from '$lib/components/Radio.svelte'
	import Search from '$lib/components/Search.svelte'
	import Select from '$lib/components/Select.svelte'
	import TimeAxis from '$lib/components/TimeAxis.svelte'
	import { userState } from '$lib/state.svelte'
	import { writable } from 'svelte/store'

	let { children } = $props()

	let projects = $derived(
		$page.data.projects.map(({ file: value, name: label }) => ({ value, label }))
	)

	let selectedProject = $derived(
		projects.find(({ label }) => label === $page.data.project.name).value
	)

	function selectProject(e) {
		goto(selectedProject)
	}

	// $effect(() => goto(selectedProject))

	const zoomOptions = [
		{
			value: 1,
			label: 'none'
		},
		{
			value: 2,
			label: 'year'
		},
		{
			value: 3,
			label: 'month'
		},
		{
			value: 4,
			label: 'day'
		}
	]

	const fileTypes = $derived(
		Object.entries($page.data.colors).map(([value, color]) => ({ value, label: value, color }))
	)
</script>

<div>
	<nav
		class="w-full bg-slate-800 text-slate-100 sticky top-0 max-xs:text-[14px] z-1"
		bind:clientHeight={userState.navHeight}
	>
		<div class="flex flex-wrap">
			<div class="flex flex-col px-4 max-xs:px-2 py-2 max-xs:py-1 gap-1 z-1">
				<span class="text-xs max-xs:hidden">project</span>
				<Select options={projects} bind:value={selectedProject} on:change={selectProject} />
			</div>
			<div class="flex xs:flex-col px-4 max-xs:px-2 py-2 max-xs:py-1 gap-1 max-xs:gap-3">
				<span class="xs:text-xs">group files by</span>
				<Radio
					label="group by"
					options={zoomOptions}
					bind:value={userState.zoom}
					name="zoom-level"
				/>
			</div>
		</div>
		<div class="flex flex-wrap">
			<div class="flex xs:flex-col px-4 max-xs:px-2 py-2 max-xs:py-1 gap-1 max-xs:gap-3">
				<span class="xs:text-xs">search</span>
				<Search bind:value={userState.fileName} placeholder="filename" />
			</div>
			<div class="flex flex-col px-4 max-xs:px-2 py-2 max-xs:py-1 gap-1">
				<span class="text-xs max-xs:hidden">filetypes</span>
				<Radio
					label="group by"
					options={fileTypes}
					bind:value={userState.fileType}
					bind:hoverValue={userState.hover.fileType}
					name="file-type"
					allowNull
					allowHover
				/>
			</div>
		</div>
		<TimeAxis />
	</nav>
	{@render children()}
</div>
