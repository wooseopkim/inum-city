import * as core from '@actions/core';
import { config } from 'dotenv';
import path from 'path';
import { getNumberEnv } from './src/env';
import handle, { Request } from './src/handle';

const ci = process.env.CI === 'true';
if (!ci) {
	config({
		path: path.resolve(__dirname, '.env.local'),
	});
}

const page = getNumberEnv('page');
const size = getNumberEnv('size');
crawl({ page, size }).catch(onError);

async function crawl(request?: Request) {
	const result = await handle(request);
	if (result === undefined) {
		return;
	}
	crawl({
		page: result.next.page,
		size: result.next.size,
		totalCount: result.totalCount,
	});
}

function onError(e: unknown) {
	if (e instanceof Error) {
		core.setFailed(e);
		return;
	}
	console.error('Unknown error occured:', e);
	core.setFailed('Unknown error');
}
