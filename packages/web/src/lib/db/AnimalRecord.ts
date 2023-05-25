type Key =
	| 'age'
	| 'orgNm'
	| 'sexCd'
	| 'careNm'
	| 'kindCd'
	| 'weight'
	| 'careTel'
	| 'colorCd'
	| 'popfile'
	| 'careAddr'
	| 'chargeNm'
	| 'filename'
	| 'happenDt'
	| 'neuterYn'
	| 'noticeNo'
	| 'noticeEdt'
	| 'noticeSdt'
	| 'officetel'
	| 'desertionNo'
	| 'happenPlace'
	| 'specialMark'
	| 'processState';

export type AnimalRecord = {
	body: Record<Key, string>;
};
