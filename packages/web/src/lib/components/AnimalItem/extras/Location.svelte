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
		text-decoration: none;
		color: initial;
	}

	a[target='_blank']::before {
		content: '🌏';
		display: inline-block;
	}

	:global(:hover) > a::before {
		animation-name: rotate;
		animation-duration: 0.2s;
		animation-iteration-count: 2;
	}

	@keyframes rotate {
		to {
			transform: rotateZ(-360deg);
		}
	}
</style>
