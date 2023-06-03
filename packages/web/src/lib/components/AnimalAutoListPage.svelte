<script lang="ts">
	import AnimalListPage from './AnimalListPage.svelte';
	import type { AnimalRecord } from '$lib/db/AnimalRecord';
	import { loadAnimalPage } from '$lib/db/animals';

	export let after: AnimalRecord | undefined = undefined;
	export let size = 10;

	const page = loadAnimalPage({ size, after });
</script>

{#await page}
	<div>loading...</div>
{:then response}
	<AnimalListPage on:loadrequest {response} />
{:catch e}
	<div style:color="red">{e.toString()}</div>
{/await}
