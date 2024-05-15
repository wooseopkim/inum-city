<script lang="ts">
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import AnimalAutoListPage from './AnimalAutoListPage.svelte';
	import AnimalListPage from './AnimalListPage.svelte';
	import type { AnimalRecord } from '$lib/db/AnimalRecord';
	import SearchInput from './SearchInput.svelte';

	export let initialResponse: PostgrestResponse<AnimalRecord>;

	let searchQuery: string | undefined = undefined;
	let pages: { after: AnimalRecord }[];
	$: {
		console.log(searchQuery);
		pages = [];
	}

	function onLoadRequest(data: AnimalRecord) {
		const concatenated = [
			...pages,
			{
				after: data,
			},
		];
		pages = [...new Set(concatenated)];
	}

	function onQueryChange(query: string) {
		searchQuery = query;
	}
</script>

<SearchInput on:search={(e) => onQueryChange(e.detail)} />
<AnimalListPage response={initialResponse} on:loadrequest={(e) => onLoadRequest(e.detail)} />
{#each pages as { after }}
	{#key after.body.desertionNo}
		<AnimalAutoListPage query={searchQuery} {after} on:loadrequest={(e) => onLoadRequest(e.detail)} />
	{/key}
{/each}
