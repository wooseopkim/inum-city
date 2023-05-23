<script lang="ts">
    import type { AnimalItem } from '$lib/db/AnimalItem';
    import type { PostgrestResponse } from '@supabase/supabase-js';
    import { createEventDispatcher, onDestroy } from 'svelte';
    import AnimalCard from './AnimalCard.svelte';
    
    export let response: PostgrestResponse<AnimalItem>;
    let data: typeof response['data'];
    let error: typeof response['error'];
    $: ({ data, error } = response);

    const dispatch = createEventDispatcher<{
        loadrequest: AnimalItem['body'];
    }>();

    let lastElement: HTMLElement;
    $: (() => {
        if (typeof IntersectionObserver === 'undefined') {
            return;
        }
        if (lastElement === undefined) {
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            const intersecting = entries[0]?.isIntersecting ?? false;
            if (intersecting) {
                dispatch('loadrequest', data?.[data.length - 1]?.body);
                observer.unobserve(lastElement);
            }
        });
        observer.observe(lastElement);
        onDestroy(() => observer.disconnect());
    })();
</script>


{#if error === null && data !== null}
    <div>
        {#each data as { body }, i}
            {#key body.desertionNo}
                {#if i === data.length - 2}
                    <div bind:this={lastElement}>
                        <AnimalCard data={body} />
                    </div>
                {:else}
                    <AnimalCard data={body} />
                {/if}
            {/key}
        {/each}
    </div>
{:else}
    <div style:color="orange">{JSON.stringify(error)}</div>
{/if}
