<script lang="ts">
	import Card from '$lib/Card.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { PUBLIC_API_BASE } from '$env/static/public';
	import DmmWidget from '$lib/DmmWidget.svelte';
	import DmmBannerWidget from '$lib/DmmBannerWidget.svelte';
	import { favoritesStore, toggleFavorite } from '$lib/favorites';

	let products: any[] = [];

	const fetchProducts = async () => {
		const { url } = get(page);
		const isBulk = url.searchParams.get('bulk') === '10';
		const campaignOnly = url.searchParams.get('campaign_only') === 'true';

		// 同人商品用のエンドポイントを指定
		let endpoint = isBulk
			? `${PUBLIC_API_BASE}/doujin/random/`
			: `${PUBLIC_API_BASE}/doujin/random-one/`;

		if (campaignOnly) {
			endpoint += '?campaign_only=true';
		}

		const res = await fetch(endpoint);
		const data = await res.json();
		products = Array.isArray(data) ? data : [data];
	};

	onMount(fetchProducts);

	const handleRetry = () => {
		products = []; // ローディング表示に戻す
		fetchProducts();
	};

	const getShareText = (product: any) => {
		const displayTitle =
			product.title.length > 80 ? product.title.substring(0, 80) + '...' : product.title;
		const prefix = product.is_sale ? '【セール中】' : '';
		return `${prefix}🎯 同人ガチャで「${displayTitle}」が当たったよ！ ${product.affiliate_url} 毎日同人ガチャ https://dmm-affi-site.vercel.app/dojin #おすすめ同人 #FANZA`;
	};

	const handleToggleFav = (product: any) => {
		toggleFavorite({
			id: product.affiliate_url,
			type: 'doujin',
			title: product.title,
			image_url: product.image_url,
			rarity: product.rarity,
			is_sale: product.is_sale
		});
	};

	$: isFav = (prod: any) =>
		$favoritesStore.some((fav) => fav.id === prod.affiliate_url && fav.type === 'doujin');
</script>

<!-- オンラインくじ20260731まで -->
<div class="my-4 flex justify-center">
	<ins class="widget-banner"></ins><script
		class="widget-banner-script"
		src="https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=honebuto-001&banner_id=1970_640_200"
	></script>
</div>

{#if products.length === 0}
	<div class="py-10 text-center text-white">
		<span class="spinner">同人ガチャを回しています...</span>
	</div>
{:else if products.length === 1}
	<div class="flex min-h-screen items-center justify-center">
		<Card maxWidth="max-w-lg">
			<h2 class="mb-4 text-2xl font-bold">🎯 同人ガチャ結果</h2>

			<a
				href={products[0].affiliate_url}
				target="_blank"
				rel="sponsored"
				class="group relative block overflow-hidden rounded-lg"
			>
				<img
					src={products[0].image_url}
					alt={products[0].title}
					class="mx-auto mb-4 h-[384px] w-[512px] max-w-full rounded-lg object-contain shadow transition-transform duration-300 group-hover:scale-105"
				/>
			</a>

			<a href={products[0].affiliate_url} target="_blank" rel="sponsored">
				<p class="mb-4 text-lg font-semibold transition hover:text-red-400">
					{#if products[0].is_sale}
						<span class="font-bold text-red-500">【セール中】</span>
					{/if}
					{products[0].rarity || 'N'}:{products[0].title}
				</p>
			</a>

			<!-- お気に入りボタン -->
			<button
				on:click={() => handleToggleFav(products[0])}
				class="mb-4 inline-flex w-full transform items-center justify-center rounded-lg px-6 py-3 text-lg font-bold shadow-md transition hover:-translate-y-0.5
            {isFav(products[0])
					? 'bg-yellow-500 text-black hover:bg-yellow-600'
					: 'border border-yellow-500 bg-gray-800 text-yellow-400 hover:bg-gray-700'}"
			>
				<span>{isFav(products[0]) ? '★ お気に入り解除' : '☆ お気に入りに追加'}</span>
			</button>

			<!-- ★ 1回ガチャ用：FANZA同人誘導メインボタン -->
			<a
				href={products[0].affiliate_url}
				target="_blank"
				rel="sponsored"
				class="mb-4 inline-flex w-full transform items-center justify-center rounded-lg bg-gradient-to-r from-pink-600 to-red-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:from-pink-700 hover:to-red-700"
			>
				<span>💋 FANZA同人で見る</span>
				<span class="ml-1 text-sm">↗</span>
			</a>

			<div class="flex items-center justify-center gap-2">
				<a
					href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(products[0]))}`}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex flex-1 items-center justify-center rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
				>
					<img src="/logo.svg" alt="Xで共有" class="mr-2 h-6 w-6" />
					<span>ツイート</span>
				</a>

				<a
					href={`https://line.me/R/share/text?text=${encodeURIComponent(getShareText(products[0]))}`}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex flex-1 items-center justify-center rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
				>
					<img src="/LINE_Brand_icon.png" alt="LINEで共有" class="mr-2 h-6 w-6" />
					<span>LINEで送る</span>
				</a>
			</div>

			<div class="mt-8 flex flex-col gap-4">
				<button
					on:click={handleRetry}
					class="w-full transform rounded-full bg-red-600 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-red-700"
				>
					🎯 もう一度引く
				</button>
				<a href="/" data-sveltekit-reload class="text-blue-400 hover:underline">🔁 トップに戻る</a>
			</div>
		</Card>
	</div>
{:else}
	<div class="min-h-screen bg-gradient-to-br from-gray-900 to-black py-10">
		<h2 class="mb-8 text-center text-3xl font-bold text-white">🎯 同人 10 連ガチャ結果</h2>

		<div class="grid gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each products as p}
				<Card maxWidth="max-w-xs">
					<a
						href={p.affiliate_url}
						target="_blank"
						rel="sponsored"
						class="group block overflow-hidden rounded-lg"
					>
						<img
							src={p.image_url}
							alt={p.title}
							class="mb-3 h-48 w-full rounded-lg object-contain shadow transition-transform duration-300 group-hover:scale-105"
						/>
					</a>

					<a href={p.affiliate_url} target="_blank" rel="sponsored">
						<p class="mb-3 line-clamp-2 text-sm font-semibold transition hover:text-red-400">
							{#if p.is_sale}
								<span class="font-bold text-red-500">【セール中】</span>
							{/if}
							{p.rarity || 'N'}:{p.title}
						</p>
					</a>

					<!-- お気に入りボタン -->
					<button
						on:click={() => handleToggleFav(p)}
						class="mb-3 inline-flex w-full items-center justify-center rounded py-2 text-xs font-bold shadow transition
                {isFav(p)
							? 'bg-yellow-500 text-black hover:bg-yellow-600'
							: 'border border-yellow-500 bg-gray-800 text-yellow-400 hover:bg-gray-700'}"
					>
						<span>{isFav(p) ? '★ お気に入り解除' : '☆ お気に入り追加'}</span>
					</button>

					<!-- ★ 10連ガチャカード用：FANZA同人誘導ボタン -->
					<a
						href={p.affiliate_url}
						target="_blank"
						rel="sponsored"
						class="mb-3 inline-flex w-full items-center justify-center rounded bg-gradient-to-r from-pink-600 to-red-500 py-2 text-sm font-bold text-white shadow transition hover:from-pink-700 hover:to-red-600"
					>
						<span>💋 FANZA同人で見る</span>
						<span class="ml-0.5 text-xs">↗</span>
					</a>

					<div class="flex gap-2">
						<a
							href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(p))}`}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex flex-1 items-center justify-center rounded bg-blue-500 px-3 py-1.5 text-xs text-white transition hover:bg-blue-600"
						>
							<img src="/logo.svg" alt="Xで共有" class="mr-1 h-4 w-4" />
							<span>ツイート</span>
						</a>

						<a
							href={`https://line.me/R/share/text?text=${encodeURIComponent(getShareText(p))}`}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex flex-1 items-center justify-center rounded bg-green-500 px-3 py-1.5 text-xs text-white transition hover:bg-green-600"
						>
							<img src="/LINE_Brand_icon.png" alt="LINEで共有" class="mr-1 h-4 w-4" />
							<span>LINE</span>
						</a>
					</div>
				</Card>
			{/each}
		</div>

		<div class="mx-auto mt-10 flex max-w-xs flex-col gap-4 text-center">
			<button
				on:click={handleRetry}
				class="w-full transform rounded-full bg-red-600 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-red-700"
			>
				🎯 もう一度 10 連を引く
			</button>
			<a href="/dojin" data-sveltekit-reload class="text-lg text-blue-400 hover:underline"
				>🔁 トップに戻る</a
			>
		</div>
	</div>
{/if}

<div class="my-6 flex flex-wrap items-center justify-center gap-4">
	<!-- ウィジェット1 -->
	<!-- <ins
		class="dmm-widget-placement"
		data-id="7466dd6057bbc4243631a4b74a3580da"
		style="background:transparent"
	></ins><script
		src="https://widget-view.dmm.co.jp/js/placement.js"
		class="dmm-widget-scripts"
		data-id="7466dd6057bbc4243631a4b74a3580da"
	></script> -->
	<!-- ゲーム放題 -->
	<ins class="widget-banner"></ins><script
		class="widget-banner-script"
		src="https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=honebuto-001&banner_id=456_300_250"
	></script>
	<!-- オンラインくじ -->
	<ins class="widget-banner"></ins><script
		class="widget-banner-script"
		src="https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=honebuto-001&banner_id=860_300_250"
	></script>
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
		content: '🎯';
		display: inline-block;
		animation: spin 1s linear infinite;
		margin-right: 8px;
	}
</style>
