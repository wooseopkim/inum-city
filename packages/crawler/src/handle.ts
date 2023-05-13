// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { PostgrestError, createClient } from '@supabase/supabase-js';
import { CustomError } from './CustomError';
import { Paginator } from './Paginator';
import { supabaseKey, supabaseUrl } from './env';
import { isUniqueViolation } from './postgres';
import { PublicApiResponse, fetchAnimalList } from './public_api';

const jsonContentTypeHeader = /^application\/json(;.+)?/;

export type Request = Partial<Paginator> & {
	totalCount?: number;
};

export default async function handle(request?: Request) {
	const paginator = new Paginator(request);
	const animalListResponse = await fetchAnimalList(paginator);
	const { status, headers, ok } = animalListResponse;

	const contentType = headers.get('Content-Type') ?? '';

	if (!jsonContentTypeHeader.test(contentType)) {
		console.error({
			status,
			headers,
			contentType,
			text: await animalListResponse.text(),
		});
		throw new CustomError('Expected JSON but got non-JSON response');
	}

	const animalListBody: PublicApiResponse = await animalListResponse.json();

	if (!ok || animalListBody.response.header.resultCode !== '00') {
		console.error({
			status,
			headers,
			request,
		});
		throw new CustomError('Expected success but got abnormal response');
	}

	const apiList =
		'body' in animalListBody.response ? animalListBody.response.body.items.item : ([] as never);
	const apiCount =
		'body' in animalListBody.response ? animalListBody.response.body.totalCount : (0 as never);
	const totalCount = request?.totalCount ?? apiCount;

	const supabase = createClient(supabaseUrl, supabaseKey);

	if (apiList === undefined || apiList.length === 0) {
		console.warn({
			status,
			headers,
			request,
			animalListBody,
		});
		throw new CustomError('End of the list');
	}

	const records = apiList.map((x) => ({
		body: x,
	}));
	let { count: dbCount } = await supabase.from('animals').select('id', {
		count: 'exact',
		head: true,
	});
	let error: PostgrestError | null = null;

	// Because upsert's onConflict parameter now currently supports field names only,
	// our jsonb expression ((body->'desertionNo'::text)) won't get parsed withour errors.
	// Instead, here we handle unique violation errors programatically.
	// Note that onConflict parameter is handled by PostgREST server.
	for (const record of records) {
		const result = await supabase.from('animals').insert(record, {
			count: 'exact',
		});
		if (result.count !== null) {
			dbCount = result.count;
		}
		error = result.error;

		if (error != null && !isUniqueViolation(error)) {
			console.error({
				error,
				record,
			});
			throw new CustomError('Error inserting data into DB');
		}
	}

	if (dbCount == null) {
		console.error({
			records,
		});
		throw new CustomError('Failed to fetch count from DB');
	}

	console.debug({
		status,
		headers,
		request,
		animalListBody,
		apiCount,
		dbCount,
		totalCount,
	});
	const dbIncomplete = dbCount < totalCount;
	const body = dbIncomplete
		? {
				next: paginator.next(),
				totalCount,
		  }
		: undefined;
	return body;
}
