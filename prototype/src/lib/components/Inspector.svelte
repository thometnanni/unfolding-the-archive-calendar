<script>
	import { userState } from "$lib/state.svelte"


let item = $derived(userState.item || userState.hover.item)


</script>

{#if item != null}
	<div class="inspector"></div>
{/if}
