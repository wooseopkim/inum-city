import { Random } from '$lib/ui/random';
import { loadAnimalPage } from '../lib/db/animals';

export async function load() {
	const initialData = await loadAnimalPage({ size: 5 });

	const random = new Random(new Date().valueOf());
	const backgroundColor = random.rgb({
		base: 216,
		diff: 32,
	});

	return {
		initialData,
		backgroundColor,
	};
}
