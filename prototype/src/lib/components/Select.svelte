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

<div class="wrapper">
	<!-- Toggle button -->
	<button
		class="toggle"
		bind:this={buttonEl}
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={toggle}
		onkeydown={onKeyDown}
	>
		{selectedLabel}
		<svg
			style="float: right; width: 1em; height: 1em;"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<polyline points="5 8 10 13 15 8"></polyline>
		</svg>
	</button>

	<!-- Options list -->
	{#if open}
		<ul class="options" bind:this={listEl} role="listbox" tabindex="-1" onkeydown={onKeyDown}>
			{#each options as opt, i}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					class="option {i === highlightedIndex ? 'highlighted' : ''}"
					role="option"
					aria-selected={opt.value === value}
					onclick={() => select(i)}
				>
					{opt.label}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	/* -------------------------------------------------
   *  Basic layout – feel free to replace these rules
   * ------------------------------------------------- */
	.wrapper {
		position: relative;
		display: inline-block;
		width: 200px; /* adjust as needed */
	}

	button.toggle {
		width: 100%;
		padding: 0.5rem 1rem;
		text-align: left;
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
	}

	button.toggle[aria-expanded='true'] {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	ul.options {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		max-height: 12rem;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		background: #fff;
		border: 1px solid #ccc;
		border-top: none;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		z-index: 10;
		list-style: none;
	}

	li.option {
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	li.option:hover,
	li.option[aria-selected='true'],
	li.option.highlighted {
		background: #f0f0f0;
	}

	/* Example of custom styling – change colors, fonts, etc. */
	.custom-theme li.option:hover {
		background: #007aff;
		color: #fff;
	}
</style>
