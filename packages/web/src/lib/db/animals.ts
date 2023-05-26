import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import type { GenericSchema } from '@supabase/postgrest-js/dist/module/types';
import type { AnimalRecord } from './AnimalRecord';
import supabase from './client';

type LoadParams = {
	size: number;
	after?: AnimalRecord;
};

export function loadAnimalPage({ size, after }: LoadParams): PostgrestFilterBuilder<GenericSchema, Record<string, unknown>, AnimalRecord[]> {
	const unpaged = supabase
		.from('animals')
		.select<string, AnimalRecord>()
		.order('body->>happenDt', { ascending: false })
		.order('body->>desertionNo', { ascending: false })
		.limit(size);

	if (after === undefined) {
		return unpaged;
	}
	return unpaged.lte('body->>happenDt', after.body.happenDt)
		.lt('body->>desertionNo', after.body.desertionNo);
}
