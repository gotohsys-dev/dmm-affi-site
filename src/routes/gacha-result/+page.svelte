<script lang="ts">
  import Card from '$lib/Card.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { PUBLIC_API_BASE } from '$env/static/public';

  /** 取得結果を格納（複数でも単数でも配列化） */
  let products: any[] = [];

  onMount(async () => {
    // クエリに ?bulk=10 が付く場合は 10 連、なければ 1 件
    const { url } = get(page);
    const isBulk = url.searchParams.get('bulk') === '10';

    const endpoint = isBulk
      ? `${PUBLIC_API_BASE}/products/random/` // 10 件
      : `${PUBLIC_API_BASE}/products/random-one/`; // 1 件

    const res = await fetch(endpoint);
    const data = await res.json();
    products = Array.isArray(data) ? data : [data];
  });
</script>

<style>
  /* 回転アニメーションのCSS */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .spinner::before {
    content: '🎯'; /* スピナーに見える任意の文字や絵文字に変更できます */
    display: inline-block;
    animation: spin 1s linear infinite;
    margin-right: 8px; /* スピナーとテキストの間にスペースを追加 */
  }
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
          <p class="text-lg font-semibold mb-6">{products[0].title}</p>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `🎯 ガチャで「${products[0].title}」が当たったよ！ ${products[0].affiliate_url} 毎日エ〇ガチャhttp://bit.ly/3I4n27L`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Xで共有する
        </a>

        <a href="/" class="text-blue-400 hover:underline">🔁 トップに戻る</a>
      </Card>
    </div>

    {:else}
    <div class="min-h-screen py-10 bg-gradient-to-br from-gray-900 to-black">
      <h2 class="text-3xl font-bold text-center text-white mb-8">🎯 10 連ガチャ結果</h2>

      <div class="grid gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <p class="text-sm font-semibold line-clamp-2">{p.title}</p>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `🎯 ガチャで「${p.title}」が当たったよ！ 毎日エ〇ガチャhttp://bit.ly/3I4n27L ${p.affiliate_url}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Xで共有する
            </a>
          </Card>
        {/each}
      </div>

      <div class="text-center mt-10">
        <a href="/" class="text-blue-400 hover:underline">🔁 トップに戻る</a>
      </div>
    </div>
  {/if}
{/if}