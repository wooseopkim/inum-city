import { PostgrestError, createClient } from '@supabase/supabase-js';
import sampleResponse from '../tests/sample-response.json';
import silent from '../tests/silent';
import handle from './handle';

const originalHandle = handle;

jest.mock('@actions/core', () => {
	return {
		getInput: (key: string) => {
			return key;
		},
	};
});
jest.mock('@supabase/supabase-js');

describe(handle, () => {
	beforeEach(() => {
		mockFetch(JSON.stringify(sampleResponse));
		mockSupabase(20, null);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const handle = silent(originalHandle);

	describe('calling public API', () => {
		it('passes default page parameters', async () => {
			await handle();

			expect(fetch).toHaveBeenCalledTimes(1);
			const url = (fetch as jest.Mock).mock.lastCall?.[0] as URL;
			expect(url.searchParams.get('pageNo')).toBe('1');
			expect(url.searchParams.get('numOfRows')).toBe('10');
		});

		it('passes given parameters', async () => {
			await handle({
				page: 12,
				size: 34,
			});

			expect(fetch).toHaveBeenCalledTimes(1);
			const url = (fetch as jest.Mock).mock.lastCall?.[0] as URL;
			expect(url.searchParams.get('pageNo')).toBe('12');
			expect(url.searchParams.get('numOfRows')).toBe('34');
		});

		it('limits size maximum', async () => {
			await handle({
				size: 20230513,
			});

			expect(fetch).toHaveBeenCalledTimes(1);
			const url = (fetch as jest.Mock).mock.lastCall?.[0] as URL;
			expect(url.searchParams.get('numOfRows')).toBe('1000');
		});
	});

	describe('handling public API response', () => {
		it('fails on XML response', async () => {
			mockFetch('', {
				headers: {
					'Content-Type': 'text/xml',
				},
			});

			const promise = handle();

			await expect(promise).rejects.toHaveProperty(
				'message',
				'Expected JSON but got non-JSON response'
			);
		});

		it('fails on bad response', async () => {
			mockFetch(JSON.stringify(sampleResponse), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const promise = handle();

			await expect(promise).rejects.toHaveProperty(
				'message',
				'Expected success but got abnormal response'
			);
		});

		it('fails on bad result code', async () => {
			mockFetch(
				JSON.stringify({
					...sampleResponse,
					response: {
						...sampleResponse.response,
						header: {
							...sampleResponse.response.header,
							resultCode: '44',
						},
					},
				})
			);

			const promise = handle();

			await expect(promise).rejects.toHaveProperty(
				'message',
				'Expected success but got abnormal response'
			);
		});
	});

	describe('handling Supabase response', () => {
		it('returns paginator for next page', async () => {
			const result = await handle();

			expect(result?.next).toEqual({
				page: 2,
				size: 10,
			});
		});

		it('returns undefined when all stored', async () => {
			mockSupabase(20230513, null);

			const result = await handle();

			expect(result?.next).toBeUndefined();
		});

		it('fails when empty list is returned', async () => {
			mockFetch(
				JSON.stringify({
					...sampleResponse,
					response: {
						...sampleResponse.response,
						body: {
							...sampleResponse.response.body,
							items: [],
						},
					},
				})
			);

			const promise = handle();

			await expect(promise).rejects.toHaveProperty('message', 'End of the list');
		});

		it('fails when db error occurs', async () => {
			mockSupabase(null, {} as PostgrestError);

			const promise = handle();

			await expect(promise).rejects.toHaveProperty('message', 'Error inserting data into DB');
		});

		it('fails when count is null', async () => {
			mockSupabase(null, null);

			const promise = handle();

			await expect(promise).rejects.toHaveProperty('message', 'Failed to fetch count from DB');
		});

		it('ignores unique violation errors', async () => {
			let i = 0;
			(createClient as jest.Mock).mockImplementation(() => ({
				from: () => ({
					insert: () =>
						Promise.resolve(
							++i % 2 === 0
								? {
										count: 10,
										error: null,
								  }
								: {
										count: null,
										error: { code: '23505' } as PostgrestError,
								  }
						),
					select: () =>
						Promise.resolve({
							count: null,
							error: {} as PostgrestError,
						}),
				}),
			}));

			const promise = handle();

			await expect(promise).resolves.not.toThrow();
		});

		it('ignores unique violation errors but still requires count', async () => {
			mockSupabase(null, { code: '23505' } as PostgrestError);

			const promise = handle();

			await expect(promise).rejects.toHaveProperty('message', 'Failed to fetch count from DB');
		});
	});
});

function mockFetch(
	body?: BodyInit,
	init: ResponseInit = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
) {
	jest.spyOn(global, 'fetch').mockImplementation(() => {
		return Promise.resolve(new Response(body, init));
	});
}

function mockSupabase(count: number | null, error: PostgrestError | null) {
	(createClient as jest.Mock).mockImplementation(() => ({
		from: () => ({
			insert: () =>
				Promise.resolve({
					count,
					error,
				}),
			select: () =>
				Promise.resolve({
					count,
					error,
				}),
		}),
	}));
}
