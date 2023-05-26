<script lang="ts">
	import { format } from "$lib/date";
	import addIntersectionListener from "$lib/dom/listeners";
	import type { AnimalItem } from "$lib/models/AnimalItem";
	import mulberry32 from "$lib/mulberry32";
	import { angle, color } from "$lib/random";
	
    export let data: AnimalItem;

    const random = mulberry32(parseInt(data.source.desertionNo, 10));

    type Sign = -1 | 1;
    const getOpts = (x: Sign) => ({
        translateX: {
            degree: x * 50,
            unit: 'vw',
        },
        rotateZ: {
            degree: 30,
        },
    });
    const directions = [[-1, 1], [1, -1], [1, 1]] as const;
    let transforms = directions.map(([x]) => getOpts(x as Sign))
            .map((x) => randomTransform(x)) as [string, string, string];

    type TransformOpts = {
        translateX: {
            degree: number;
            unit: string;
        };
        translateY?: {
            degree: number;
            unit: string;
        };
        rotateZ: {
            degree: number;
        };
    };
    function randomTransform({ translateX, translateY, rotateZ }: TransformOpts) {
        return [
            `translateX(${random() * translateX.degree}${translateX.unit})`,
            `translateY(${random() * (translateY?.degree ?? 0)}${translateY?.unit ?? ''})`,
            `rotateZ(${angle(random, rotateZ.degree)}deg)`,
        ].join(' ');
    }

    let el: HTMLElement;
    $: addIntersectionListener(el, (observer) => {
        flyInAsideSections();
        observer.unobserve(el);
    });

    function flyInAsideSections() {
        const getOpts = (x: Sign, y: Sign) => ({
            translateX: {
                degree: x * 5,
                unit: 'rem',
            },
            translateY: {
                degree: y * 2,
                unit: 'rem',
            },
            rotateZ: {
                degree: 10,
            },
        });
        transforms = directions.map(([x, y]) => getOpts(x as Sign, y as Sign))
            .map((x) => randomTransform(x)) as [string, string, string];
    }

    function randomColor() {
        return `rgb(${color(random).join(', ')})`;
    }
</script>

<div class="container">
    {#if !data.terminated}
        <aside bind:this={el}>
            <section class="map" style:transform={transforms[0]} style:background-color={randomColor()}>
                <a href={`https://map.kakao.com/?q=${data.source.careAddr}`} target="_blank" referrerpolicy="no-referrer">
                    {data.source.careAddr}
                </a>
            </section>
        </aside>
    {/if}
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
    {#if !data.terminated}
        <aside class="contacts">
            <section class="authority name-card" style:transform={transforms[1]} style:background-color={randomColor()}>
                <span>보호소</span>
                <h4>{data.source.careNm}</h4>
                <a href={`tel:${data.source.careTel}`}>{data.source.careTel}</a>
            </section>
            <section class="shelter name-card" style:transform={transforms[2]} style:background-color={randomColor()}>
                <span>관할기관</span>
                <h4>{data.source.orgNm} {data.source.chargeNm ?? ''}</h4>
                <a href={`tel:${data.source.officetel}`}>{data.source.officetel}</a>
            </section>
        </aside>
    {/if}
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        --shadow-color: rgba(0, 0, 0, 0.9);
        --border-width: 4px;
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
        --padding-horizontal: 1.5rem;
        --padding-vertical: 2rem;
        padding: var(--padding-horizontal) var(--padding-vertical);
        width: 50rem;
        max-width: calc(80cqi - 2 * var(--padding-horizontal) - 2 * var(--margin-horizontal));
        transition-duration: 0.1s;
        transition-property: box-shadow, transform, opacity;
        transition-timing-function: ease-in-out;
        cursor: pointer;
        position: relative;

        &:not([data-terminated="true"]):hover {
            --shadow-offset: 24px;

            & .note {
                animation-name: note-bound;
                animation-duration: 0.2s;
                animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1);
            }
        }

        @media (max-width: 768px) {
            --padding-horizontal: 2rem;
            --padding-vertical: 1.5rem;
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

    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-block-end: 1rem;
        font-weight: 900;
        
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

        & img {
            border-radius: calc(var(--card-border-radius) * 0.5);
            --thumbnail-size: 140px;
            width: var(--thumbnail-size);
            height: var(--thumbnail-size);
            margin: 0.5rem;
            object-fit: cover;
            background-color: grey;
        }

        & p {
            margin-inline-start: 1.6em;
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
        transition-property: scale;

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

    @keyframes -global-note-bound {
        50% {
            --shadow-offset: 8px;
            box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
            --translate-by: calc(0px - var(--shadow-offset) / 2);
            transform: translateX(var(--translate-by)) translateY(var(--translate-by));
            scale: 101%;
        }
    }

    aside > * {
        border: var(--border-width) solid black;
        border-radius: 6px;
        width: 12rem;
        height: 7rem;
        padding: 1rem;
        display: flex;
        align-items: end;
        justify-content: flex-end;
        flex-direction: column;
        text-align: end;
        word-break: keep-all;
        line-height: 2;
        transition-property: transform, scale, box-shadow;
        transition-duration: 0.5s;
        position: relative;

        &:hover {
            scale: 1.05;
            z-index: 1;
            --shadow-offset: 8px;
            box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
        }

        &.map {
            line-height: 1.5;
        }

        &.name-card h4 {
            margin: 0;
            line-height: 1;
        }

        & a[target="_blank"]::before {
            content: '🌏';
        }

        & a[href^="tel:"]::before {
             content: '📞';
        }
    }
</style>
