import mulberry32 from '$lib/mulberry32';
import { color } from '$lib/random';
import { loadAnimalPage } from '../lib/db/animals';

export async function load() {
	const initialData = await loadAnimalPage({ size: 5 });

    const random = mulberry32(new Date().valueOf());
    const backgroundColor = color(random, {
        base: 216,
        diff: 32,
    });

	return {
		initialData,
		backgroundColor,
	};
}
