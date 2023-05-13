import type { Paginator } from './Paginator.js';
import { publicApiKey } from './env.js';

export type PublicApiResponse = {
	response:
		| {
				header: {
					reqNo: string;
					resultCode: never;
					resultMsg: string;
					errorMsg: string;
				};
		  }
		| {
				header: {
					reqNo: string;
					resultCode: '00';
					resultMsg: string;
				};
				body: {
					items: {
						item: Record<string, unknown>[];
					};
					numOfRows: number;
					pageNo: number;
					totalCount: number;
				};
		  };
};

const MAX_SIZE = 1000; // https://www.data.go.kr/data/15098931/openapi.do

export async function fetchAnimalList({ page, size }: Paginator) {
	const url = new URL('http://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic');
	const { searchParams } = url;
	searchParams.set('serviceKey', publicApiKey);
	searchParams.set('pageNo', String(page));
	searchParams.set('numOfRows', String(Math.min(size, MAX_SIZE)));
	searchParams.set('_type', 'json');
	return await fetch(url);
}
