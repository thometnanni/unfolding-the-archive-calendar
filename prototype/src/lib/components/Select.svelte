<script>
	import { browser } from '$app/environment'

	import { onMount, onDestroy, createEventDispatcher } from 'svelte'
	import { tick } from 'svelte'

	let { options, value = $bindable() } = $props()

	const dispatch = createEventDispatcher()

	/** -------------------------------------------------
	 *  Internal state
	 * ------------------------------------------------- */
	let open = $state(false)
	let buttonEl
	let listEl = $state()

	// Find the label for the current value
	let selectedLabel = $derived(options.find((o) => o.value === value)?.label)

	// Close dropdown when clicking outside
	const handleClickOutside = (event) => {
		if (!buttonEl?.contains(event.target) && !listEl?.contains(event.target)) {
			open = false
		}
	}

	onMount(() => {
		if (!browser) return
		document.addEventListener('click', handleClickOutside)
	})

	onDestroy(() => {
		if (!browser) return
		document.removeEventListener('click', handleClickOutside)
	})

	/** -------------------------------------------------
	 *  Keyboard navigation (optional but recommended)
	 * ------------------------------------------------- */
	let highlightedIndex = $state(-1)

	function openMenu() {
		open = true
		highlightedIndex = options.findIndex((o) => o.value === value)
		// Wait for the list to render before focusing
		tick().then(() => listEl?.focus())
	}

	function toggle() {
		open ? (open = false) : openMenu()
	}

	function select(idx) {
		const opt = options[idx]
		if (opt) {
			value = opt.value

			dispatch('change', value)
			open = false
		}
	}

	function onKeyDown(event) {
		if (!open) {
			if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
				event.preventDefault()
				openMenu()
			}
			return
		}

		switch (event.key) {
			case 'Escape':
				open = false
				break
			case 'ArrowDown':
				event.preventDefault()
				highlightedIndex = (highlightedIndex + 1) % options.length
				scrollIntoView()
				break
			case 'ArrowUp':
				event.preventDefault()
				highlightedIndex = (highlightedIndex - 1 + options.length) % options.length
				scrollIntoView()
				break
			case 'Enter':
			case ' ':
				event.preventDefault()
				select(highlightedIndex)
				break
		}
	}

	function scrollIntoView() {
		const item = listEl?.children[highlightedIndex]
		item?.scrollIntoView({ block: 'nearest' })
	}
</script>

<div class="relative inline-block w-[280px]">
	<!-- Toggle button -->
	<button
		class="w-full cursor-pointer flex items-center gap-2 text-slate-100"
		bind:this={buttonEl}
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={toggle}
		onkeydown={onKeyDown}
	>
		{selectedLabel}
		<svg
			class:rotate-180={open}
			xmlns="http://www.w3.org/2000/svg"
			width="17"
			height="17"
			viewBox="0 0 17 17"
			><path
				fill="currentColor"
				fill-rule="evenodd"
				d="M122.5,28 C127.19442,28 131,31.8055796 131,36.5 C131,41.1944204 127.19442,45 122.5,45 C117.80558,45 114,41.1944204 114,36.5 C114,31.8055796 117.80558,28 122.5,28 Z M125.674604,35.1203717 L122.5,37.841 L119.325396,35.1203717 L118.674604,35.8796283 L122.5,39.1585389 L126.325396,35.8796283 L125.674604,35.1203717 Z"
				transform="translate(-114 -28)"
			/></svg
		>
	</button>

	<!-- Options list -->
	{#if open}
		<ul
			class="absolute top-full left-0 right-0 overflow-y-auto max-h-[calc(100vh-52px)] flex flex-col items-start pt-1 -ml-4 text-slate-400"
			style="scrollbar-width: none;"
			bind:this={listEl}
			role="listbox"
			tabindex="-1"
			onkeydown={onKeyDown}
			onclick={() => (open = false)}
		>
			{#each options as opt, i}
				{@const selected = opt.value === value}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					class="bg-slate-800 cursor-pointer option px-4 py-1 hover:text-slate-100 flex gap-2 items-center"
					class:text-slate-100={selected}
					role="option"
					aria-selected={selected}
					onclick={() => select(i)}
				>
					{opt.label}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
</style>
