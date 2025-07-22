<script>
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { PUBLIC_API_BASE } from '$env/static/public';
  import DmmWidget from '$lib/DmmWidget.svelte';
  import DmmBannerWidget from '$lib/DmmBannerWidget.svelte';

  let video = null;
  let isLoadingVideo = true;

  onMount(async () => {
    try {
      const res = await fetch(`${PUBLIC_API_BASE}/videos/random-one/`);
      video = await res.json();
      isLoadingVideo = false;
    } catch (error) {
      console.error("動画データの取得に失敗しました:", error);
      isLoadingVideo = false;
    }
  });

  async function rollGacha(count) {
    const isBulk = count === 10;
    await goto(`/video-gacha-result${isBulk ? '?bulk=10' : ''}`);
  }
</script>

<div class="text-center p-4">
  <h1 class="text-2xl font-bold mb-4">🎬 毎日動画ガチャ</h1>
  <p class="mb-6">数万作品からランダムで表示(画面更新すると表示が変わります☆)</p>
</div>

<div class="text-center p-4">
  {#if isLoadingVideo}
    <div class="flex items-center justify-center w-[512px] h-[384px] mx-auto bg-gray-200 rounded-lg shadow">
      <p class="text-xl text-gray-700">動画読み込み中...</p>
    </div>
  {:else if video}
    <iframe
      src={video.video_url}
      class="mx-auto w-[512px] h-[384px] max-w-full rounded-lg shadow"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
      title={video.title}
    ></iframe>
    <p class="mt-4">
      <a href={video.affiliate_url} target="_blank" rel="noopener" class="text-blue-400 hover:underline">
        商品ページで見る
      </a>
    </p>
  {:else}
    <p class="text-xl text-gray-500">動画の取得に失敗しました。</p>
  {/if}
</div>

<div class="mt-6 text-center">
  <button
    on:click={() => rollGacha(1)}
    class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
  >
    ガチャを回す
  </button>

  <button
    on:click={() => rollGacha(10)}
    class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
  >
    10連ガチャ
  </button>
</div>

<div class="my-6 flex flex-wrap justify-center items-center gap-4">
  <DmmWidget dataId="043481a98d238feacca4c97e7b47d21b" />
  <DmmBannerWidget affiliate_id="honebuto-001" banner_id="1209_300_250" />
</div>

