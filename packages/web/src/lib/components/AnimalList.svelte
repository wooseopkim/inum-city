<script lang="ts">
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import AnimalAutoListPage from './AnimalAutoListPage.svelte';
	import AnimalListPage from './AnimalListPage.svelte';
	import SearchInput from './SearchInput.svelte';
	import type { AnimalRecord } from '$lib/db/AnimalRecord';

	export let initialResponse: PostgrestResponse<AnimalRecord>;
	export let query: string | undefined = undefined;

	const dummyResponse: PostgrestResponse<AnimalRecord> = {
		data: [],
		error: null,
	} as unknown as PostgrestResponse<AnimalRecord>;

	type Page = { after: AnimalRecord | null; query: string | null };

	let pages: Page[] = [];

	function onLoadRequest(data: AnimalRecord | null) {
		if (data === null && pages.length > 0) {
			return;
		}
		pages = [...pages, { after: data, query: query ?? null }];
	}

	let pid: ReturnType<typeof setTimeout> | undefined = undefined;
	function onSearch(value: string) {
		clearTimeout(pid);
		pid = setTimeout(() => {
			if (query !== value) {
				pages = [];
			}
			query = value;
		}, 500);
	}
</script>

<SearchInput on:search={(e) => onSearch(e.detail)} />
<AnimalListPage
	response={query ? dummyResponse : initialResponse}
	on:loadrequest={(e) => onLoadRequest(e.detail)}
/>
{#each pages as { after }}
	{#key after?.body?.desertionNo ?? 0}
		<AnimalAutoListPage
			{query}
			after={after ?? undefined}
			on:loadrequest={(e) => onLoadRequest(e.detail)}
		/>
	{/key}
{/each}
