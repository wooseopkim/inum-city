<script lang="ts">
	import type { AnimalItem } from "$lib/models/AnimalItem";

    export let data: AnimalItem;
</script>

<header>
    <li>{data.source.noticeNo}</li>
    <li>{data.source.desertionNo}</li>
    <li>{data.source.processState}</li>
</header>

<style>
    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-block-end: 1rem;
        font-weight: 900;
        
        @media (max-width: 768px) {
            flex-direction: column;
        }
        
        & li {
            display: inline-block;
            background-color: white;
            border: var(--border-width) solid black;
            --padding-horizontal: 0.5rem;
            --padding-vertical: 0.5rem;
            padding-block-start: var(--padding-vertical);
            padding-block-end: var(--padding-vertical);
            padding-inline-start: var(--padding-horizontal);
            padding-inline-end: var(--padding-horizontal);

            &:first-of-type {
                border-start-start-radius: var(--card-border-radius);
                border-end-start-radius: var(--card-border-radius);
                padding-inline-start: calc(var(--padding-horizontal) * 2);
            }
            &:last-of-type {
                border-end-end-radius: var(--card-border-radius);
                border-start-end-radius: var(--card-border-radius);
                padding-inline-end: calc(var(--padding-horizontal) * 2);
            }
            &:not(:first-of-type) {
                border-left: none;
            }
            &:not(:last-of-type) {
                border-right: none;
            }
            &::marker {
                content: '';
            }
        }
    }
</style>

