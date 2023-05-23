import type { AnimalItem } from './AnimalItem';
import supabase from './client';

type LoadParams = {
	size: number;
	after?: string;
};

export function loadAnimalPage({ size, after }: LoadParams) {
	const unpaged = supabase
		.from('animals')
		.select<'body', AnimalItem>('body')
		.order('body->desertionNo', { ascending: false })
		.limit(size);

	if (after === undefined) {
		return unpaged;
	}
	return unpaged.lt('body->desertionNo::text', `"${after}"`);
}
