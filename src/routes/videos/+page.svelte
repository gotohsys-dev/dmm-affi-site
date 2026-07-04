<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_BASE } from '$env/static/public';
	import DmmWidget from '$lib/DmmWidget.svelte';
	import DmmBannerWidget from '$lib/DmmBannerWidget.svelte';

	let video = null;
	let isLoadingVideo = true;

	const fetchRandomVideo = async () => {
		try {
			isLoadingVideo = true; // ローディング状態を開始
			const res = await fetch(`${PUBLIC_API_BASE}/videos/random-one/`);
			video = await res.json();
			isLoadingVideo = false;
		} catch (error) {
			console.error('動画データの取得に失敗しました:', error);
			isLoadingVideo = false;
			video = null; // エラー時は動画をクリア
		}
	};

	onMount(fetchRandomVideo);

	let campaignOnly = false;

	// ガチャを回すボタンは別のページに遷移するため、既存のまま
	async function rollGacha(count) {
		const isBulk = count === 10;
		let query = `?bulk=${isBulk ? '10' : '1'}`;
		if (campaignOnly) {
			query += '&campaign_only=true';
		}
		await goto(`/video-gacha-result${query}`);
	}
</script>

<div class="p-4 text-center">
	<h1 class="mb-4 text-2xl font-bold">🎬 毎日動画ガチャ</h1>
	<p class="mb-6">数万作品からランダムで表示(画面更新すると表示が変わります☆)</p>
</div>

<div class="p-4 text-center">
	{#if isLoadingVideo}
		<div
			class="mx-auto flex h-[384px] w-[512px] items-center justify-center rounded-lg bg-gray-200 shadow"
		>
			<p class="text-xl text-gray-700">動画読み込み中...</p>
		</div>
	{:else if video}
		<iframe
			src={video.video_url}
			class="mx-auto h-[384px] w-[512px] max-w-full rounded-lg shadow"
			frameborder="0"
			allow="autoplay; encrypted-media"
			allowfullscreen
			title={video.title}
		></iframe>
		<p class="mt-4">
			<a
				href={video.affiliate_url}
				target="_blank"
				rel="noopener"
				class="text-blue-400 hover:underline"
			>
				商品ページで見る
			</a>
		</p>
	{:else}
		<p class="text-xl text-gray-500">動画の取得に失敗しました。</p>
	{/if}
</div>

<div class="mt-6 text-center">
	<button
		on:click={fetchRandomVideo}
		class="transform rounded-full bg-red-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-red-700"
	>
		🎬 別の動画を見る
	</button>
</div>
<div class="mt-6 text-center">
	<div class="mb-4 flex items-center justify-center gap-2">
		<input
			type="checkbox"
			id="campaign-only-checkbox"
			bind:checked={campaignOnly}
			class="h-5 w-5 cursor-pointer rounded border-gray-300 text-pink-600 focus:ring-pink-500"
		/>
		<label
			for="campaign-only-checkbox"
			class="cursor-pointer text-sm font-semibold text-gray-200 select-none"
		>
			セール中の作品のみをガチャる
		</label>
	</div>

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
	<DmmWidget dataId="043481a98d238feacca4c97e7b47d21b" />
	<DmmBannerWidget affiliate_id="honebuto-001" banner_id="1209_300_250" />
</div>
