<script lang="ts">
	import type { AnimalItem } from "$lib/db/AnimalItem";

    export let data: AnimalItem['body'];
</script>

<div>
    <h3>{data.noticeNo}</h3>
    <div>유기번호 {data.desertionNo}</div>
    <div>나이 {data.age}</div>
    <div>성별 {data.sexCd}</div>
    <div>{data.orgNm} / {data.careNm} ({data.happenPlace})</div>
    <div>상태 {data.processState}</div>
    <img src={data.filename} alt="미리보기">
    <blockquote>{data.specialMark}</blockquote>
</div>
