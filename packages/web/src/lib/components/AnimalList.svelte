<script lang="ts">
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import AnimalAutoListPage from './AnimalAutoListPage.svelte';
	import AnimalListPage from './AnimalListPage.svelte';
	import type { AnimalRecord } from '$lib/db/AnimalRecord';

	export let initialResponse: PostgrestResponse<AnimalRecord>;

	let pages: { after: AnimalRecord }[] = [];

	function onLoadRequest(data: AnimalRecord) {
		const concatenated = [
			...pages,
			{
				after: data,
			},
		];
		pages = [...new Set(concatenated)];
	}
</script>

<AnimalListPage response={initialResponse} on:loadrequest={(e) => onLoadRequest(e.detail)} />
{#each pages as { after }}
	{#key after.body.desertionNo}
		<AnimalAutoListPage {after} on:loadrequest={(e) => onLoadRequest(e.detail)} />
	{/key}
{/each}
