import type { PostgrestError } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { AnimalRecord } from '$lib/db/AnimalRecord';

export type AnimalPage =
	| {
			id: string;
			loading: false;
			content: AnimalRecord[] | null;
			error: null | PostgrestError;
	  }
	| {
			id: string;
			loading: true;
			after: AnimalRecord | undefined;
			query: string | undefined;
			size: number;
	  };

const pages = writable([] as AnimalPage[]);

export default pages;
