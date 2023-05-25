<script>
	import AnimalList from "$lib/components/AnimalList.svelte";

    export let data;
</script>

<svelte:head>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquareNeo/NanumSquareNeo.css" type="text/css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/KCCJeongbeom/KCCJeongbeom.css" type="text/css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css" type="text/css"/>
</svelte:head>

<main style:background-color={`rgb(${data.backgroundColor.join(', ')})`}>
    <AnimalList initialResponse={data.initialData} />
</main>

<style>
    :root {
        font-family: 'Nanum Square Neo', sans-serif;
        font-size: 1.1rem;
        font-weight: 800;
    }

    :global(.cursive) {
        font-family: 'KCC Jeongbeom', cursive;
        font-weight: 600;
    }

    main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow-x: hidden;
    }
</style>
