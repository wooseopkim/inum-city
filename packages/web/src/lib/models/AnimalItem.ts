import { parseString } from '$lib/date';
import type { AnimalRecord } from '$lib/db/AnimalRecord';
import mulberry32 from '$lib/mulberry32';
import { color } from '$lib/random';

const neutralizedLabels = {
    'Y': ['완료', '한'],
    'N': ['받지 않', '은'],
    'U': ['알 수 없', '는'],
} as Record<string, [string, string]>;

const sexLabels = {
    'M': '수컷',
    'F': '암컷',
    'Q': '성별 미상',
} as Record<string, string>;

export class AnimalItem {
    source: AnimalRecord['body'];

    terminated: boolean;
    primaryColor: string;
    highlightColor: string;
    age: string;
    weight: string;
    neutralizedLabel: [string, string];
    sex: string;
    foundAt: Date;
    noticeStart: Date;
    noticeEnd: Date;
    
    constructor(source: AnimalRecord['body']) {
        this.source = source;

        const terminated = Boolean(source.processState.match(/종료\s*\(.+?사\)/));
        this.terminated = terminated;
        
        const random = mulberry32(parseInt(source.desertionNo));
        const rgb = color(random);
        this.primaryColor = terminated ? 'darkgrey' : `rgb(${rgb.join(', ')})`;
        this.highlightColor = terminated ? 'lightgrey' : `rgba(${rgb.join(', ')}, 0.4)`;
        
        const { year, desc, suffix } = source.age.match(/(?<year>.+?)(\((?<desc>.+?)\))?\((?<suffix>.+)\)/)?.groups ?? {};
        this.age = desc ?? `${year ?? ''}${suffix ?? ''}`;

        this.weight = source.weight.toLowerCase().replace(/[()]/g, '');

        this.neutralizedLabel = neutralizedLabels[source.neuterYn] ?? neutralizedLabels['U'];

        this.sex = sexLabels[source.sexCd] ?? sexLabels['Q'];

        this.foundAt = parseString(source.happenDt);
        this.noticeStart = parseString(source.noticeSdt);
        this.noticeEnd = parseString(source.noticeEdt);
    }
};
