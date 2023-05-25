<script lang="ts">
    import type { AnimalRecord } from '$lib/db/AnimalRecord';
    import addIntersectionListener from '$lib/dom/listeners';
    import { AnimalItem } from '$lib/models/AnimalItem';
    import type { PostgrestResponse } from '@supabase/supabase-js';
    import { createEventDispatcher } from 'svelte';
    import AnimalCard from './AnimalCard.svelte';
    
    export let response: PostgrestResponse<AnimalRecord>;
    let data: typeof response['data'];
    let error: typeof response['error'];
    $: ({ data, error } = response);

    const dispatch = createEventDispatcher<{
        loadrequest: AnimalRecord['body'];
    }>();

    let lastElement: HTMLElement;
    $: addIntersectionListener(lastElement, (observer) => {
        dispatch('loadrequest', data?.[data.length - 1]?.body);
        observer.unobserve(lastElement);
    });
</script>


{#if error === null && data !== null}
    <div>
        {#each data as { body }, i}
            {@const item = new AnimalItem(body)}
            {#key body.desertionNo}
                {#if i === data.length - 2}
                    <div bind:this={lastElement}>
                        <AnimalCard data={item} />
                    </div>
                {:else}
                    <AnimalCard data={item} />
                {/if}
            {/key}
        {/each}
    </div>
{:else}
    <div style:color="orange">{JSON.stringify(error)}</div>
{/if}
