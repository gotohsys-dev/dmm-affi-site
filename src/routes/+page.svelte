<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_BASE } from '$env/static/public'; // PUBLIC_API_BASEをインポートしていることを確認
	import DmmWidget from '$lib/DmmWidget.svelte'; // DmmWidgetコンポーネントをインポート
	import DmmWidget2 from '$lib/DmmWidget2.svelte'; // DmmWidgetコンポーネントをインポート
	import DmmBannerWidget from '$lib/DmmBannerWidget.svelte'; // DmmBannerWidgetコンポーネントをインポート
	import TwitterTimeline from '$lib/TwitterTimeline.svelte';

	let products = [];
	let currentIndex = 0;
	let twitterLoaded = true;
	let isLoadingImage = true;

	console.log('PUBLIC_API_BASE:', PUBLIC_API_BASE);

	onMount(async () => {
		try {
			const res = await fetch(`${PUBLIC_API_BASE}/products/random/`);
			products = await res.json();
			console.log('取得したproducts:', products);

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
			console.error('製品データの取得に失敗しました:', error);
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

	// ガチャを回す
	async function rollGacha(count) {
		const isBulk = count === 10;
		await goto(`/gacha-result${isBulk ? '?bulk=10' : ''}`);
	}
</script>

<div class="p-4 text-center">
	<h1 class="mb-4 text-2xl font-bold">🎯 毎日AVガチャ</h1>
	<p class="mb-6">数万作品からランダムで表示(画面更新すると表示が変わります☆)</p>
</div>

<div class="p-4 text-center">
	{#if products.length === 0}
		<p class="text-xl text-gray-500">商品データを読み込み中...</p>
	{:else}
		<div
			class="relative mx-auto aspect-[4/3] w-full max-w-[512px] overflow-hidden rounded-lg bg-gray-200 shadow"
		>
			{#if isLoadingImage}
				<div
					class="absolute inset-0 z-10 flex items-center justify-center bg-gray-200/80 backdrop-blur-sm"
				>
					<p class="text-xl text-gray-700">画像読み込み中...</p>
				</div>
			{/if}

			<a
				href={products[currentIndex].affiliate_url}
				target="_blank"
				rel="noopener"
				class="flex h-full w-full items-center justify-center"
			>
				<img
					src={products[currentIndex].image_url}
					alt="AVジャケット"
					class="h-full w-full object-contain"
				/>
			</a>
		</div>
	{/if}
</div>

<!-- FANZAキャッチャー -->
<div class="my-4 flex justify-center">
	<ins class="widget-banner"></ins><script
		class="widget-banner-script"
		src="https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=honebuto-001&banner_id=1329_640_100"
	></script>
</div>

<div class="mt-6 text-center">
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
	<!-- <DmmWidget dataId="043481a98d238feacca4c97e7b47d21b" /> -->
	<!-- <DmmBannerWidget affiliate_id="honebuto-001" banner_id="1209_300_250" /> -->
	<!-- <DmmWidget dataId="7466dd6057bbc4243631a4b74a3580da" /> -->
	<!-- <DmmBannerWidget affiliate_id="honebuto-001" banner_id="1526_300_250" /> -->
	<ins class="dmm-widget-placement" data-id="7466dd6057bbc4243631a4b74a3580da" style="background:transparent"></ins><script src="https://widget-view.dmm.co.jp/js/placement.js" class="dmm-widget-scripts" data-id="7466dd6057bbc4243631a4b74a3580da"></script>
	<ins class="widget-banner"></ins><script
		class="widget-banner-script"
		src="https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=honebuto-001&banner_id=1942_300_250"
	></script>
	<ins class="widget-banner"></ins><script class="widget-banner-script" src="https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=honebuto-001&banner_id=1390_300_250"></script>
</div>

<section
	class="mx-auto mt-12 max-w-2xl rounded-xl bg-white/80 p-6 text-gray-800 shadow-lg backdrop-blur-md"
>
	<h2 class="mb-4 text-center text-2xl font-bold">このサイトについて</h2>
	<p class="mb-3 leading-relaxed">
		このサイトは、DMMアフィリエイトの公式APIを活用して、毎日違ったAV作品に出会える「ガチャ機能」を提供しています。
		ボタンをクリックすると、ランダムに選ばれた作品が表示され、気になる作品は画像クリックでDMMの公式ページからすぐに購入・視聴が可能です。
		DMMのリンクのみしかありませんので、安心・安全です。
	</p>
	<p class="mb-3 leading-relaxed">
		AVガチャを回すだけのサイトですが、今後もコンテンツを拡充予定です。
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
