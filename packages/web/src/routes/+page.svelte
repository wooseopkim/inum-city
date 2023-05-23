<script>
	import AnimalList from "$lib/components/AnimalList.svelte";
	
    export let data;
</script>

<AnimalList initialResponse={data.initialData} />
