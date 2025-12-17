<script>
	let { placeholder, value = $bindable() } = $props()
</script>

<div class="w-[280px]">
	<input class="bg-transparent border-0 p-0 focus:outline-hidden" bind:value {placeholder} />
</div>
