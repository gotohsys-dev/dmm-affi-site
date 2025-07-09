<script lang="ts">
  import Card from '$lib/Card.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { PUBLIC_API_BASE } from '$env/static/public';
  import DmmWidget from '$lib/DmmWidget.svelte';
  import DmmBannerWidget from '$lib/DmmBannerWidget.svelte';

  let videos: any[] = [];

  onMount(async () => {
    const { url } = get(page);
    const isBulk = url.searchParams.get('bulk') === '10';

    const endpoint = isBulk
      ? `${PUBLIC_API_BASE}/videos/random/`
      : `${PUBLIC_API_BASE}/videos/random-one/`;

    const res = await fetch(endpoint);
    const data = await res.json();
    videos = Array.isArray(data) ? data : [data];
  });
</script>

<style>
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .spinner::before {
    content: '🎬';
    display: inline-block;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }
</style>

{#if videos.length === 0}
  <div class="text-center text-white py-10">
    <span class="spinner">ガチャを回しています...</span>
  </div>
{:else}
  {#if videos.length === 1}
    <div class="flex justify-center items-center min-h-screen">
      <Card maxWidth="max-w-lg">
        <h2 class="text-2xl font-bold mb-4">🎬 動画ガチャ結果</h2>
        <iframe src={videos[0].video_url} class="mx-auto object-contain w-[512px] h-[384px] max-w-full rounded-lg shadow mb-4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen title={videos[0].title}></iframe>
        <a href={videos[0].affiliate_url} target="_blank" rel="sponsored">
          <p class="text-lg font-semibold mb-6">{videos[0].rarity}:{videos[0].title}</p>
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎬 動画ガチャで「${videos[0].title}」が当たったよ！ #動画ガチャ https://dmm-affi-site.vercel.app/ ${videos[0].affiliate_url}`)}`} target="_blank" rel="noopener noreferrer" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Xで共有する
        </a>
        <a href="/videos" class="text-blue-400 hover:underline">🔁 動画ガチャに戻る</a>
      </Card>
    </div>
  {:else}
    <div class="min-h-screen py-10 bg-gradient-to-br from-gray-900 to-black">
      <h2 class="text-3xl font-bold text-center text-white mb-8">🎬 10連動画ガチャ結果</h2>
      <div class="grid gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each videos as v}
          <Card maxWidth="max-w-xs">
            <iframe src={v.video_url} class="object-contain w-full h-48 rounded-lg shadow mb-3" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen title={v.title}></iframe>
            <a href={v.affiliate_url} target="_blank" rel="sponsored">
              <p class="text-sm font-semibold line-clamp-2">{v.rarity}:{v.title}</p>
            </a>
          </Card>
        {/each}
      </div>
      <div class="text-center mt-10">
        <a href="/videos" class="text-blue-400 hover:underline">🔁 動画ガチャに戻る</a>
      </div>
    </div>
  {/if}
{/if}

<div class="my-6 flex flex-wrap justify-center items-center gap-4">
  <DmmWidget dataId="043481a98d238feacca4c97e7b47d21b" />
  <DmmBannerWidget affiliate_id="honebuto-001" banner_id="1209_300_250" />
</div>