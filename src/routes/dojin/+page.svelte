<script>
  import { onMount } from "svelte";
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
      // 同人商品のランダムリストを取得
      const res = await fetch(`${PUBLIC_API_BASE}/doujin/random/`);
      products = await res.json();

      if (products.length > 0) {
        const img = new Image();
        img.src = products[currentIndex].image_url;
        img.onload = () => {
          isLoadingImage = false;
          rotate();
        };
        img.onerror = () => {
          console.error("画像のロードに失敗しました:", products[currentIndex].image_url);
          isLoadingImage = false;
          rotate();
        };
      } else {
        isLoadingImage = false;
      }

    } catch (error) {
      console.error("同人誌データの取得に失敗しました:", error);
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
          console.error("画像のロードに失敗しました:", products[currentIndex].image_url);
          isLoadingImage = false;
        };
      } else {
        isLoadingImage = false;
      }
    }, 1500);
  }

  // 同人ガチャを回す
  async function rollGacha(count) {
    const isBulk = count === 10;
    await goto(`/dojin-gacha-result${isBulk ? '?bulk=10' : ''}`);
  }
</script>

<div class="text-center p-4">
  <h1 class="text-2xl font-bold mb-4">🎯 毎日同人ガチャ</h1>
  <p class="mb-6">人気の同人誌からランダムで表示(画面更新すると表示が変わります☆)</p>
</div>

<div class="text-center p-4">
  {#if products.length === 0}
    <p class="text-xl text-gray-500">商品データを読み込み中...</p>
  {:else if isLoadingImage}
    <div class="flex items-center justify-center w-[512px] h-[384px] mx-auto bg-gray-200 rounded-lg shadow">
      <p class="text-xl text-gray-700">画像読み込み中...</p>
    </div>
  {:else}
    <a href={products[currentIndex].affiliate_url} target="_blank" rel="noopener">
      <img
        src={products[currentIndex].image_url}
        alt="同人誌ジャケット"
        class="mx-auto object-contain w-[512px] h-[384px] max-w-full rounded-lg shadow"
      />
    </a>
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
  <DmmWidget dataId="7466dd6057bbc4243631a4b74a3580da" />
  <DmmBannerWidget affiliate_id="honebuto-001" banner_id="1526_300_250" />
</div>

<section class="max-w-2xl mx-auto mt-12 p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg text-gray-800">
  <h2 class="text-2xl font-bold mb-4 text-center">このサイトについて</h2>
  <p class="mb-3 leading-relaxed">
    このサイトは、DMMアフィリエイトの公式APIを活用して、毎日違った同人誌に出会える「ガチャ機能」を提供しています。
    ボタンをクリックすると、ランダムに選ばれた作品が表示され、気になる作品は画像クリックでFANZA同人の公式ページからすぐに購入・視聴が可能です。
    DMMのリンクのみしかありませんので、安心・安全です。
  </p>
  <p class="mb-3 leading-relaxed">
    同人誌ガチャを回すだけのサイトですが、今後もコンテンツを拡充予定です。
  </p>
  <p class="text-sm text-gray-600">
    ※ 当サイトはDMMアフィリエイトプログラムに参加しており、リンク先の商品を購入されると、運営者に報酬が発生することがあります。
  </p>
</section>

<div class="my-8">
  <h2 class="text-2xl font-bold text-center mb-4">X (Twitter)</h2>
  <div class="max-w-xl mx-auto">
    <TwitterTimeline />
  </div>
</div>