<script lang="ts">
	import type { AnimalRecord } from '$lib/db/AnimalRecord';
	import { loadAnimalPage } from '$lib/db/animals';
	import AnimalListPage from './AnimalListPage.svelte';

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
