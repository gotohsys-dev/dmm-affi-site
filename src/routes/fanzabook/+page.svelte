<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_BASE } from '$env/static/public';
	import DmmWidget from '$lib/DmmWidget.svelte';
	import DmmBannerWidget from '$lib/DmmBannerWidget.svelte';
	import TwitterTimeline from '$lib/TwitterTimeline.svelte';

	let products = [];
	let currentIndex = 0;
	let isLoadingImage = true;

	onMount(async () => {
		try {
			// 電子書籍商品のランダムリストを取得
			const res = await fetch(`${PUBLIC_API_BASE}/fanzabook/random/`);
			products = await res.json();

			if (products.length > 0) {
				const img = new Image();
				img.src = products[currentIndex].image_url;
				img.onload = () => {
					isLoadingImage = false;
					rotate();
				};
				img.onerror = () => {
					console.error('画像のロードに失敗しました:', products[currentIndex].image_url);
					isLoadingImage = false;
					rotate();
				};
			} else {
				isLoadingImage = false;
			}
		} catch (error) {
			console.error('電子書籍データの取得に失敗しました:', error);
			isLoadingImage = false;
		}
	});

	// 作品ルーレット
	function rotate() {
		setInterval(() => {
			currentIndex = (currentIndex + 1) % products.length;
			isLoadingImage = true;
			if (products.length > 0) {
				const img = new Image();
				img.src = products[currentIndex].image_url;
				img.onload = () => {
					isLoadingImage = false;
				};
				img.onerror = () => {
					console.error('画像のロードに失敗しました:', products[currentIndex].image_url);
					isLoadingImage = false;
				};
			} else {
				isLoadingImage = false;
			}
		}, 1500);
	}

	let campaignOnly = false;

	// 電子書籍ガチャを回す
	async function rollGacha(count) {
		const isBulk = count === 10;
		let query = `?bulk=${isBulk ? '10' : '1'}`;
		if (campaignOnly) {
			query += '&campaign_only=true';
		}
		window.location.href = `/fanzabook-gacha-result${query}`;
	}
</script>

<div class="p-4 text-center">
	<h1 class="mb-4 text-2xl font-bold">🎯 毎日エ〇本ガチャ</h1>
	<p class="mb-6">人気の電子書籍からランダムで表示(画面更新すると表示が変わります☆)</p>
</div>

<div class="p-4 text-center">
	{#if products.length === 0}
		<p class="text-xl text-gray-500">商品データを読み込み中...</p>
	{:else if isLoadingImage}
		<div
			class="mx-auto flex h-[384px] w-[512px] items-center justify-center rounded-lg bg-gray-200 shadow"
		>
			<p class="text-xl text-gray-700">画像読み込み中...</p>
		</div>
	{:else}
		<a href={products[currentIndex].affiliate_url} target="_blank" rel="noopener">
			<img
				src={products[currentIndex].image_url}
				alt="電子書籍ジャケット"
				class="mx-auto h-[384px] w-[512px] max-w-full rounded-lg object-contain shadow"
			/>
		</a>
	{/if}
</div>

<div class="mt-6 text-center">
	<!-- <div class="mb-4 flex items-center justify-center gap-2">
    <input
      type="checkbox"
      id="campaign-only-checkbox"
      bind:checked={campaignOnly}
      class="h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
    />
    <label for="campaign-only-checkbox" class="text-sm font-semibold text-gray-200 cursor-pointer select-none">
      セール中の作品のみをガチャる
    </label>
  </div> -->

	<button
		on:click={() => rollGacha(1)}
		class="rounded bg-pink-600 px-4 py-2 font-bold text-white hover:bg-pink-700"
	>
		ガチャを回す
	</button>

	<button
		on:click={() => rollGacha(10)}
		class="rounded bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700"
	>
		10連ガチャ
	</button>
</div>

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

<section
	class="mx-auto mt-12 max-w-2xl rounded-xl bg-white/80 p-6 text-gray-800 shadow-lg backdrop-blur-md"
>
	<h2 class="mb-4 text-center text-2xl font-bold">このサイトについて</h2>
	<p class="mb-3 leading-relaxed">
		このサイトは、DMMアフィリエイトの公式APIを活用して、毎日違った電子書籍に出会える「ガチャ機能」を提供しています。
		ボタンをクリックすると、ランダムに選ばれた作品が表示され、気になる作品は画像クリックでFANZA同人の公式ページからすぐに購入・視聴が可能です。
		DMMのリンクのみしかありませんので、安心・安全です。
	</p>
	<p class="mb-3 leading-relaxed">
		電子書籍ガチャを回すだけのサイトですが、今後もコンテンツを拡充予定です。
	</p>
	<p class="text-sm text-gray-600">
		※
		当サイトはDMMアフィリエイトプログラムに参加しており、リンク先の商品を購入されると、運営者に報酬が発生することがあります。
	</p>
</section>

<div class="my-8">
	<h2 class="mb-4 text-center text-2xl font-bold">X (Twitter)</h2>
	<div class="mx-auto max-w-xl">
		<TwitterTimeline />
	</div>
</div>
