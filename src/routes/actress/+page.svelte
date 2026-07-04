<script>
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { PUBLIC_API_BASE } from '$env/static/public';
  import DmmWidget from '$lib/DmmWidget.svelte';
  import DmmBannerWidget from '$lib/DmmBannerWidget.svelte';
  import TwitterTimeline from '$lib/TwitterTimeline.svelte';

  let actresses = [];
  let currentIndex = 0;
  let isLoadingImage = true;

  onMount(async () => {
    try {
      const res = await fetch(`${PUBLIC_API_BASE}/actress/random/`); 
      const data = await res.json();
      actresses = data.filter(a => a.image_url);

      if (actresses.length > 0) {
        const img = new Image();
        img.src = actresses[currentIndex].image_url;
        img.onload = () => {
          isLoadingImage = false;
          rotate();
        };
        img.onerror = () => {
          isLoadingImage = false;
          rotate();
        };
      } else {
        isLoadingImage = false;
      }
    } catch (error) {
      console.error("女優データの取得に失敗しました:", error);
      isLoadingImage = false;
    }
  });

  function rotate() {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % actresses.length;
      isLoadingImage = true;
      if (actresses.length > 0) {
        const img = new Image();
        img.src = actresses[currentIndex].image_url;
        img.onload = () => {
          isLoadingImage = false;
        };
        img.onerror = () => {
          console.error("画像のロードに失敗しました:", actresses[currentIndex].image_url);
          isLoadingImage = false;
        };
      } else {
        isLoadingImage = false;
      }
    }, 1500);
  }

  async function rollGacha(count) {
    const isBulk = count === 10;
    await goto(`${base}/actress-gacha-result${isBulk ? '?bulk=10' : ''}`);
  }
</script>

<div class="text-center p-4">
  <h1 class="text-2xl font-bold mb-4">🎯 女優ガチャ(※開発中)</h1>
  <p class="mb-6">人気女優から新人までランダムで表示(画面更新すると表示が変わります☆)</p>
</div>

<div class="text-center p-4">
  {#if actresses.length === 0}
    <p class="text-xl text-gray-500">データ読み込み中...</p>
  {:else if isLoadingImage}
    <div class="flex items-center justify-center w-[512px] h-[384px] mx-auto bg-gray-200 rounded-lg shadow">
      <p class="text-xl text-gray-700">画像読み込み中...</p>
    </div>
  {:else}
    <div class="relative inline-block">
      <img
        src={actresses[currentIndex].image_url}
        alt={actresses[currentIndex].name}
        class="mx-auto object-contain w-[512px] h-[384px] max-w-full rounded-lg shadow"
      />
      <div class="absolute bottom-2 left-0 right-0 text-white bg-black/50 py-1">
        {actresses[currentIndex].name} ({actresses[currentIndex].ruby})
      </div>
    </div>
  {/if}
</div>

<div class="mt-6 text-center flex justify-center gap-4">
  <button
    on:click={() => rollGacha(1)}
    class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-8 rounded shadow-lg transition-transform active:scale-95"
  >
    ガチャを回す
  </button>

  <button
    on:click={() => rollGacha(10)}
    class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded shadow-lg transition-transform active:scale-95"
  >
    10連ガチャ
  </button>
</div>

<div class="my-6 flex flex-wrap justify-center items-center gap-4">
  <DmmWidget dataId="7466dd6057bbc4243631a4b74a3580da" />
  <DmmBannerWidget affiliate_id="honebuto-001" banner_id="1526_300_250" />
</div>

<section class="max-w-2xl mx-auto mt-12 p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg text-gray-800 border border-gray-100">
  <h2 class="text-2xl font-bold mb-4 text-center">女優ガチャについて</h2>
  <p class="mb-3 leading-relaxed">
    DMMに登録されている膨大な女優データから、ランダムに一人をピックアップします。
    詳細なプロフィール（身長・スリーサイズなど）と共に、その女優の作品一覧へダイレクトにアクセス可能です。
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