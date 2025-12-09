<script>
	import Calendar from '$lib/components/Calendar.svelte'
	import Zoom from '$lib/components/Zoom.svelte'
</script>

<Zoom>
	{#snippet children(zoom)}
		<Calendar {zoom} />
	{/snippet}
</Zoom>
