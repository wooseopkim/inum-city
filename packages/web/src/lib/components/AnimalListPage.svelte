<script lang="ts">
    import type { AnimalRecord } from '$lib/db/AnimalRecord';
    import addIntersectionListener from '$lib/dom/listeners';
    import { AnimalItem } from '$lib/models/AnimalItem';
    import type { PostgrestResponse } from '@supabase/supabase-js';
    import { createEventDispatcher } from 'svelte';
    import Item from './AnimalItem.svelte';
    
    export let response: PostgrestResponse<AnimalRecord>;
    let data: typeof response['data'];
    let error: typeof response['error'];
    $: ({ data, error } = response);

    const dispatch = createEventDispatcher<{
        loadrequest: AnimalRecord;
    }>();

    let lastElement: HTMLElement;
    $: addIntersectionListener(lastElement, (observer) => {
        dispatch('loadrequest', data?.[data.length - 1]);
        observer.unobserve(lastElement);
    });
</script>

{#if error === null && data !== null}
    {#each data as { body }, i}
        {@const item = new AnimalItem(body)}
        {#key body.desertionNo}
            {#if i === data.length - 2}
                <Item data={item} />
                <div bind:this={lastElement} />
            {:else}
                <Item data={item} />
            {/if}
        {/key}
    {/each}
{:else}
    <div style:color="orange">{JSON.stringify(error)}</div>
{/if}
