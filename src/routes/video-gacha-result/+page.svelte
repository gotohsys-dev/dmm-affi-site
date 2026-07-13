<script lang="ts">
	import Card from '$lib/Card.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { PUBLIC_API_BASE } from '$env/static/public';
	import DmmWidget from '$lib/DmmWidget.svelte';
	import DmmBannerWidget from '$lib/DmmBannerWidget.svelte';
	import { favoritesStore, toggleFavorite } from '$lib/favorites';

	let videos: any[] = [];

	onMount(async () => {
		const { url } = get(page);
		const isBulk = url.searchParams.get('bulk') === '10';
		const campaignOnly = url.searchParams.get('campaign_only') === 'true';

		let endpoint = isBulk
			? `${PUBLIC_API_BASE}/videos/random/`
			: `${PUBLIC_API_BASE}/videos/random-one/`;

		if (campaignOnly) {
			endpoint += '?campaign_only=true';
		}

		const res = await fetch(endpoint);
		const data = await res.json();
		videos = Array.isArray(data) ? data : [data];
	});

	const getShareText = (video: any) => {
		const displayTitle =
			video.title.length > 80 ? video.title.substring(0, 80) + '...' : video.title;
		const prefix = video.is_sale ? '【セール中】' : '';
		return `${prefix}🎬 動画ガチャで「${displayTitle}」が当たったよ！ ${video.affiliate_url} #動画ガチャ #おすすめAV https://dmm-affi-site.vercel.app/`;
	};

	const handleToggleFav = (video: any) => {
		toggleFavorite({
			id: video.affiliate_url,
			type: 'video',
			title: video.title,
			video_url: video.video_url,
			rarity: video.rarity,
			is_sale: video.is_sale
		});
	};

	$: isFav = (v: any) =>
		$favoritesStore.some((fav) => fav.id === v.affiliate_url && fav.type === 'video');
</script>

<!-- 見放題Ch -->
<div class="my-4 flex justify-center">
	<ins class="widget-banner"></ins><script
		class="widget-banner-script"
		src="https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=honebuto-001&banner_id=1828_640_100"
	></script>
</div>

{#if videos.length === 0}
	<div class="py-10 text-center text-white">
		<span class="spinner">ガチャを回しています...</span>
	</div>
{:else if videos.length === 1}
	<div class="flex min-h-screen items-center justify-center">
		<Card maxWidth="max-w-lg">
			<h2 class="mb-4 text-2xl font-bold">🎬 動画ガチャ結果</h2>
			<iframe
				src={videos[0].video_url}
				class="mx-auto mb-4 h-[384px] w-[512px] max-w-full rounded-lg object-contain shadow"
				frameborder="0"
				allow="autoplay; encrypted-media"
				allowfullscreen
				title={videos[0].title}
			></iframe>
			<a href={videos[0].affiliate_url} target="_blank" rel="sponsored">
				<p class="mb-6 text-lg font-semibold">
					{#if videos[0].is_sale}
						<span class="font-bold text-red-500">【セール中】</span>
					{/if}
					{videos[0].rarity}{#if videos[0].rank}
						({videos[0].rank}位){/if}:{videos[0].title}
				</p>
			</a>

			<!-- お気に入りボタン -->
			<button
				on:click={() => handleToggleFav(videos[0])}
				class="mb-4 inline-flex w-full transform items-center justify-center rounded-lg px-6 py-3 text-lg font-bold shadow-md transition hover:-translate-y-0.5
            {isFav(videos[0])
					? 'bg-yellow-500 text-black hover:bg-yellow-600'
					: 'border border-yellow-500 bg-gray-800 text-yellow-400 hover:bg-gray-700'}"
			>
				<span>{isFav(videos[0]) ? '★ お気に入り解除' : '☆ お気に入りに追加'}</span>
			</button>

			<div class="flex items-center justify-center gap-2">
				<a
					href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(videos[0]))}`}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-4 inline-flex flex-1 items-center justify-center rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
				>
					<img src="/logo.svg" alt="Xで共有" class="mr-2 h-6 w-6" />
					<span>ツイート </span>
				</a>

				<a
					href={`https://line.me/R/share/text?text=${encodeURIComponent(getShareText(videos[0]))}`}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-4 inline-flex flex-1 items-center justify-center rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
				>
					<img src="/LINE_Brand_icon.png" alt="LINEで共有" class="mr-2 h-6 w-6" />
					<span>LINEで送る</span>
				</a>
			</div>

			<a
				href="/videos"
				data-sveltekit-reload
				class="mt-4 block text-center text-blue-400 hover:underline">🔁 動画ガチャに戻る</a
			>
		</Card>
	</div>
{:else}
	<div class="min-h-screen bg-gradient-to-br from-gray-900 to-black py-10">
		<h2 class="mb-8 text-center text-3xl font-bold text-white">🎬 10連動画ガチャ結果</h2>
		<div class="grid gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each videos as v}
				<Card maxWidth="max-w-xs">
					<iframe
						src={v.video_url}
						class="mb-3 h-48 w-full rounded-lg object-contain shadow"
						frameborder="0"
						allow="autoplay; encrypted-media"
						allowfullscreen
						title={v.title}
					></iframe>
					<a href={v.affiliate_url} target="_blank" rel="sponsored">
						<p class="line-clamp-2 text-sm font-semibold">
							{#if v.is_sale}
								<span class="font-bold text-red-500">【セール中】</span>
							{/if}
							{v.rarity}{#if v.rank}
								({v.rank}位){/if}:{v.title}
						</p>
					</a>

					<!-- お気に入りボタン -->
					<button
						on:click={() => handleToggleFav(v)}
						class="mt-3 inline-flex w-full items-center justify-center rounded py-2 text-xs font-bold shadow transition
                {isFav(v)
							? 'bg-yellow-500 text-black hover:bg-yellow-600'
							: 'border border-yellow-500 bg-gray-800 text-yellow-400 hover:bg-gray-700'}"
					>
						<span>{isFav(v) ? '★ お気に入り解除' : '☆ お気に入り追加'}</span>
					</button>

					<div class="flex gap-2">
						<a
							href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(v))}`}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-4 inline-flex flex-1 items-center justify-center rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
						>
							<img src="/logo.svg" alt="Xで共有" class="mr-2 h-6 w-6" />
							<span>ツイート</span>
						</a>

						<a
							href={`https://line.me/R/share/text?text=${encodeURIComponent(getShareText(v))}`}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-4 inline-flex flex-1 items-center justify-center rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
						>
							<img src="/LINE_Brand_icon.png" alt="LINEで共有" class="mr-2 h-6 w-6" />
							<span>LINEで送る</span>
						</a>
					</div>
				</Card>
			{/each}
		</div>
		<div class="mt-10 text-center">
			<a href="/videos" data-sveltekit-reload class="text-blue-400 hover:underline"
				>🔁 動画ガチャに戻る</a
			>
		</div>
	</div>
{/if}

<div class="my-6 flex flex-wrap items-center justify-center gap-4">
	<DmmWidget dataId="043481a98d238feacca4c97e7b47d21b" />
	<DmmBannerWidget affiliate_id="honebuto-001" banner_id="1209_300_250" />
</div>

<style>
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.spinner::before {
		content: '🎬';
		display: inline-block;
		animation: spin 1s linear infinite;
		margin-right: 8px;
	}
</style>
