<script lang="ts">
  import Card from '$lib/Card.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { PUBLIC_API_BASE } from '$env/static/public';
  import DmmWidget from '$lib/DmmWidget.svelte';
  import DmmBannerWidget from '$lib/DmmBannerWidget.svelte';
  import TwitterTimeline from '$lib/TwitterTimeline.svelte';
  
  let products: any[] = [];

  const fetchProducts = async () => {
    const { url } = get(page); // 現在のURLからbulkパラメータを判定
    const isBulk = url.searchParams.get('bulk') === '10';

    const endpoint = isBulk
      ? `${PUBLIC_API_BASE}/products/random/`
      : `${PUBLIC_API_BASE}/products/random-one/`;

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
    const displayTitle = product.title.length > 80 ? product.title.substring(0, 80) + '...' : product.title;
    const prefix = product.is_sale ? '【セール中】' : '';
    return `${prefix}🎯 ガチャで「${displayTitle}」が当たったよ！ ${product.affiliate_url} 毎日エ〇ガチャhttps://dmm-affi-site.vercel.app/ #おすすめAV #推し女優 #FANZA`;
  };
</script>

<style>
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .spinner::before {
    content: '🎯';
    display: inline-block;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }
  /* .share-button {
    flex: 1;
    text-align: center;
  } */
</style>

{#if products.length === 0}
  <div class="text-center text-white py-10">
    <span class="spinner">ガチャを回しています...</span>
  </div>
{:else}
  {#if products.length === 1}
    <div class="flex justify-center items-center min-h-screen">
      <Card maxWidth="max-w-lg">
        <h2 class="text-2xl font-bold mb-4">🎯 ガチャ結果</h2>

        <a href={products[0].affiliate_url} target="_blank" rel="sponsored">
          <img
            src={products[0].image_url}
            alt={products[0].title}
            class="mx-auto object-contain w-[512px] h-[384px] max-w-full rounded-lg shadow mb-4"
          />
        </a>

        <a href={products[0].affiliate_url} target="_blank" rel="sponsored">
          <p class="text-lg font-semibold mb-6">
            {#if products[0].is_sale}
              <span class="text-red-500 font-bold">【セール中】</span>
            {/if}
            {products[0].rarity}:{products[0].title}
          </p>
        </a>

        <div class="flex gap-2 justify-center items-center">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(products[0]))}`}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 mt-4 inline-flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <img src="/logo.svg" alt="Xで共有" class="h-6 w-6 mr-2" />
            <span>ツイート
            </span>
          </a>

          <a
            href={`https://line.me/R/share/text?text=${encodeURIComponent(getShareText(products[0]))}`}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 mt-4 inline-flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <img src="/LINE_Brand_icon.png" alt="LINEで共有" class="h-6 w-6 mr-2" />
            <span>LINEで送る</span>
          </a>
        </div>

        <div class="mt-8 flex flex-col gap-4">
          <button
            on:click={handleRetry}
            class="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition shadow-lg transform hover:scale-105"
          >
            🎯 もう一度引く
          </button>
          <a href="/" class="text-blue-400 hover:underline">🔁 トップに戻る</a>
        </div>
      </Card>
    </div>

    {:else}
    <div class="min-h-screen py-10 bg-gradient-to-br from-gray-900 to-black">
      <h2 class="text-3xl font-bold text-center text-white mb-8">🎯 10 連ガチャ結果</h2>

      <div class="grid gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <!-- <div class="grid gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"> -->
        {#each products as p}
          <Card maxWidth="max-w-xs">
            <a href={p.affiliate_url} target="_blank" rel="sponsored">
              <img
                src={p.image_url}
                alt={p.title}
                class="object-contain w-full h-48 rounded-lg shadow mb-3"
              />
            </a>

            <a href={p.affiliate_url} target="_blank" rel="sponsored">
              <p class="text-sm font-semibold line-clamp-2">
                {#if p.is_sale}
                  <span class="text-red-500 font-bold">【セール中】</span>
                {/if}
                {p.rarity}:{p.title}
              </p>
            </a>

          <div class="flex gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(p))}`}
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 mt-4 inline-flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              <img src="/logo.svg" alt="Xで共有" class="h-6 w-6 mr-2" />
              <span>ツイート</span>
            </a>

            <a
              href={`https://line.me/R/share/text?text=${encodeURIComponent(getShareText(p))}`}
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 mt-4 inline-flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              <img src="/LINE_Brand_icon.png" alt="LINEで共有" class="h-6 w-6 mr-2" />
              <span>LINEで送る</span>
            </a>
          </div>

          </Card>
        {/each}
      </div>

      <div class="max-w-xs mx-auto text-center mt-10 flex flex-col gap-4">
        <button
          on:click={handleRetry}
          class="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition shadow-lg transform hover:scale-105"
        >
          🎯 もう一度 10 連を引く
        </button>
        <a href="/" class="text-blue-400 hover:underline text-lg">🔁 トップに戻る</a>
      </div>
    </div>
  {/if}
{/if}

<div class="my-6 flex flex-wrap justify-center items-center gap-4">
  <DmmWidget dataId="043481a98d238feacca4c97e7b47d21b" />
  <DmmBannerWidget affiliate_id="honebuto-001" banner_id="1526_300_250" />
</div>