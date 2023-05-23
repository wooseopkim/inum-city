import { loadAnimalPage } from '../lib/db/animals';

export async function load() {
	const initialData = await loadAnimalPage({ size: 5 });
	return {
		initialData,
	};
}
