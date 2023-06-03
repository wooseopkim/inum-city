<script>
	import '$lib/assets/fonts/kcc-jeongbeom/style.css';
	import '$lib/assets/fonts/nanum-square-neo/style.css';
	import 'modern-normalize';
	import AnimalList from '$lib/components/AnimalList.svelte';

	export let data;
</script>

<svelte:head>
	<link rel="preconnect" href="https://cdn.jsdelivr.net" />
</svelte:head>

<main style:background-color={data.backgroundColor}>
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
	}

	:root,
	main {
		overflow-x: hidden;
	}

	:global(*) {
		box-sizing: initial;
	}
</style>
