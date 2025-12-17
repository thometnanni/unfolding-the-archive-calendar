<script>
	let { label, options, value = $bindable(), name, allowNull } = $props()
</script>

<div class="flex gap-3 flex-wrap">
	{#each options as option}
		{@const selected = option.value === value}
		<label
			class="text-slate-400 cursor-pointer flex items-center gap-2"
			class:!text-slate-100={selected || value === null}
		>
			<input
				class="hidden"
				type="radio"
				value={option.value}
				{name}
				checked={selected}
				onchange={() => (value = option.value)}
				onclick={() => selected && (value = null)}
			/>
			{#if option.color}
				<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
					<circle
						r="8.5"
						cx="8.5"
						cy="8.5"
						fill={option.color}
						opacity={selected || value === null ? 1 : 0.5}
					/>
				</svg>
			{/if}
			{option.label}
		</label>
	{/each}
</div>
