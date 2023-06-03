import { loadAnimalPage } from '../lib/db/animals';
import { Random } from '$lib/ui/random';

const MINUTE_IN_MILLIS = 1000 * 60;

export async function load() {
	const initialData = await loadAnimalPage({ size: 5 });

	const seed = Math.floor(Date.now() / MINUTE_IN_MILLIS);
	const random = new Random(seed);
	const backgroundColor = random.rgb({
		base: 216,
		diff: 32,
	});

	return {
		initialData,
		backgroundColor,
	};
}
