<script lang="ts">
	import ExtraCard from './ExtraCard.svelte';

	export let address: string;
</script>

<ExtraCard id={0} slideInFrom={['left', 'down']}>
	<a href={`https://map.kakao.com/?q=${address}`} target="_blank" referrerpolicy="no-referrer">
		{address}
	</a>
</ExtraCard>

<style>
	a {
		line-height: 1.5;
	}

	a[target='_blank']::before {
		content: '🌏';
	}
</style>
