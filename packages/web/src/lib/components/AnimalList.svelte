<script lang="ts">
	import type { AnimalItem } from '$lib/db/AnimalItem';
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import AnimalAutoListPage from "./AnimalAutoListPage.svelte";
	import AnimalListPage from "./AnimalListPage.svelte";

    export let initialResponse: PostgrestResponse<AnimalItem>;

    let pages: { after: string; }[] = [];

    function onLoadRequest(data: AnimalItem['body']) {
        const concatenated = [...pages, {
            after: data.desertionNo as string,
        }];
        pages = [...new Set(concatenated)];
    }
</script>

<AnimalListPage response={initialResponse} on:loadrequest={(e) => onLoadRequest(e.detail)} />
{#each pages as { after }}
    {#key after}
        <AnimalAutoListPage {after} on:loadrequest={(e) => onLoadRequest(e.detail)} />
    {/key}
{/each}
