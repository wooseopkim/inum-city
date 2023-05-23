<script lang="ts">
    import { loadAnimalPage } from '$lib/db/animals';
    import AnimalListPage from './AnimalListPage.svelte';

    export let after: string | undefined = undefined;
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
