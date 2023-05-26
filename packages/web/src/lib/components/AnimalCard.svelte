<script lang="ts">
	import type { AnimalItem } from "$lib/models/AnimalItem";
	import { format } from "$lib/ui/date";
	import Contacts from "./AnimalCard/Contacts.svelte";
	import Location from "./AnimalCard/Location.svelte";
	
    export let data: AnimalItem;
    let showExtras: boolean;
    $: (showExtras = !data.terminated);
</script>

<div class="container">
    <article style:background-color={data.primaryColor} data-terminated={data.terminated}>
        <header>
            <li>{data.source.noticeNo}</li>
            <li>{data.source.desertionNo}</li>
            <li>{data.source.processState}</li>
        </header>
        <section class="body">
            <img src={data.source.filename} alt="미리보기">
            <div>
                <p>
                    중성화 <mark style:background-color={data.highlightColor}>{data.neutralizedLabel[0]}</mark>{data.neutralizedLabel[1]}
                    <mark style:background-color={data.highlightColor}>{data.age}</mark>에
                    <mark style:background-color={data.highlightColor}>{data.weight}</mark>짜리
                    <mark style:background-color={data.highlightColor}>{data.sex}</mark>
                    <mark style:background-color={data.highlightColor}>{data.source.kindCd}</mark>
                </p>
                <p>
                    <mark style:background-color={data.highlightColor}>{format(data.foundAt)}</mark>에
                    <mark style:background-color={data.highlightColor}>{data.source.happenPlace}</mark>에서 발견
                </p>
                <p>
                    <mark style:background-color={data.highlightColor}>{format(data.noticeStart)}</mark>부터
                    <mark style:background-color={data.highlightColor}>{format(data.noticeEnd)}</mark>까지 공고
                </p>
            </div>
        </section>
        <section class="cursive note">
            <span style:background-color={data.primaryColor} />
            {data.source.specialMark}
        </section>
    </article>
    {#if showExtras}
        <section class="extras">
            <Location address={data.source.careAddr} />
            <div class="extra-spacer" />
            <Contacts {data} />
        </section>
    {/if}
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        --shadow-color: rgba(0, 0, 0, 0.9);
        --border-width: 4px;
        --card-width: 50rem;

        @media (max-width: 1440px) {
            flex-direction: column;
            overflow-y: hidden;
        }
    }

    article {
        border: var(--border-width) solid black;
        --card-border-radius: 16px;
        border-radius: var(--card-border-radius);
        --shadow-offset: 8px;
        box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
        transform: translateX(calc(0px - var(--shadow-offset) / 2));
        --margin-horizontal: 1rem;
        --margin-vertical: 2rem;
        margin-inline-start: var(--margin-horizontal);
        margin-inline-end: var(--margin-horizontal);
        margin-block-start: var(--margin-vertical);
        margin-block-end: var(--margin-vertical);
        --padding-horizontal: 2rem;
        --padding-vertical: 1.5rem;
        padding: var(--padding-vertical) var(--padding-horizontal);
        width: var(--card-width);
        max-width: calc(80cqi - 2 * var(--padding-horizontal) - 2 * var(--margin-horizontal));
        transition-duration: 0.2s;
        transition-property: box-shadow, transform, opacity;
        transition-timing-function: ease-in-out;
        cursor: pointer;
        position: relative;
        z-index: 1;
        
        @media (max-width: 768px) {
            --margin-horizontal: 0.5rem;
            --margin-vertical: 1rem;
            --padding-horizontal: 1rem;
            --padding-vertical: 1rem;
        }

        &:not([data-terminated="true"]):hover {
            --shadow-offset: 24px;

            & .note {
                animation-name: note-bound;
                animation-duration: 0.4s;
                animation-timing-function: ease-in-out;
            }
        }

        &[data-terminated="true"] {
            filter: brightness(0.8);
            box-shadow: none;

            &:not(:hover) {
                opacity: 0.6;
            }

            & img {
                filter: grayscale(1);
            }

            & section.note {
                box-shadow: none;
            }
        }
    }

    @keyframes -global-note-bound {
        50% {
            --shadow-offset: 8px;
            box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
            scale: 101%;
        }
    }

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

    .body {
        border: var(--border-width) solid black;
        border-radius: var(--card-border-radius);
        background-color: white;
        display: flex;
        align-items: center;
        flex-direction: row;

        @media (max-width: 768px) {
            flex-direction: column;
        }

        & img {
            border-radius: calc(var(--card-border-radius) * 0.5);
            --thumbnail-size: 140px;
            width: var(--thumbnail-size);
            height: var(--thumbnail-size);
            --margin: 0.5rem;
            margin: var(--margin);
            object-fit: cover;
            background-color: grey;

            @media (max-width: 768px) {
                width: calc(100% - var(--margin) * 2);
            }
        }

        & p {
            margin-inline-start: 1.6em;

            @media (max-width: 768px) {
                margin-inline-start: 0.5rem;
                margin-inline-end: 0.5rem;
            }
        }

        & p mark {
            --padding-horizontal: 0.2em;
            --padding-vertical: 0.2em;
            padding-block-start: var(--padding-vertical);
            padding-block-end: var(--padding-vertical);
            padding-inline-start: var(--padding-horizontal);
            padding-inline-end: var(--padding-horizontal);
            backdrop-filter: brightness(0.7) opacity(0.5) saturate(1.1);
            font-weight: 900;
        }
    }

    .note {
        border: var(--border-width) solid black;
        background-color: white;
        margin-block-start: 1rem;
        --padding-horizontal: 1.5rem;
        --padding-vertical: 1rem;
        padding-block-start: var(--padding-vertical);
        padding-block-end: var(--padding-vertical);
        padding-inline-start: var(--padding-horizontal);
        padding-inline-end: var(--padding-horizontal);
        display: flex;
        align-items: center;
        --shadow-offset: 6px;
        box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
        --translate-by: calc(0px - var(--shadow-offset) / 2);
        transform: translateX(var(--translate-by)) translateY(var(--translate-by));

        & > span {
            border: 3px solid black;
            border-radius: 50%;
            display: inline-block;
            --bullet-size: 0.5rem;
            width: var(--bullet-size);
            height: var(--bullet-size);
            margin-inline-end: 2rem;
            --shadow-offset: 2px;
            box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
            --translate-by: calc(0px - var(--shadow-offset) / 2);
            transform: translateX(var(--translate-by)) translateY(var(--translate-by));
        }
    }

    .extras {
        display: none;

        @media (min-width: 768px) and (max-width: 1440px) {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            overflow-x: clip;
            padding-block-end: 1.2rem;

            & > *:last-child {
                display: flex;
            }
        }

        @media (min-width: 1440px) {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            width: 100%;

            & .extra-spacer {
                width: var(--card-width);
                --padding-horizontal: 6rem;
                padding-inline-start: var(--padding-horizontal);
                padding-inline-end: var(--padding-horizontal);
            }
        }
    }
</style>
