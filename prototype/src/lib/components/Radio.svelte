<script>
	let { label, options, value = $bindable(), name } = $props()
</script>

<div class="flex">
	<span class="px-2">{label}</span>
	{#each options as option}
		{@const selected = option.value === value}
		<label
			class="px-2 border-l border-l-slate-700 text-slate-300"
			class:bg-slate-600={selected}
			class:text-white={selected}
		>
			<input
				class="hidden"
				type="radio"
				value={option.value}
				{name}
				checked={selected}
				onchange={() => (value = option.value)}
			/>
			{option.label}
		</label>
	{/each}
</div>
