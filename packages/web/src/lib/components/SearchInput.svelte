<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{
		search: string;
	}>();

  function onChange(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement | null;
    dispatch('search', target?.value ?? undefined);
  }
</script>

<input on:keydown={onChange}>

<style>
  input {
    width: 100%;
  }
</style>
