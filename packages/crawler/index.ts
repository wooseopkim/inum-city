import { setFailed } from '@actions/core';
import { getNumberEnv } from './src/env';
import handle, { type Request } from './src/handle';

const page = getNumberEnv('page');
const size = getNumberEnv('size');
crawl({ page, size }).catch(onError);

async function crawl(request?: Request) {
	const result = await handle(request);
	if (result === undefined) {
		return;
	}
	await crawl({
		page: result.next.page,
		size: result.next.size,
		totalCount: result.totalCount,
	});
}

function onError(e: unknown) {
	if (e instanceof Error) {
		setFailed(e);
		return;
	}
	console.error('Unknown error occured:', e);
	setFailed('Unknown error');
}
