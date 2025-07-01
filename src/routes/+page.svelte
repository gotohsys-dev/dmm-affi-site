<script>
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { PUBLIC_API_BASE } from '$env/static/public';

  let products = [];
  let currentIndex = 0;
  let isLoadingImage = true; // twitterLoaded は不要なので削除

  console.log("PUBLIC_API_BASE:", PUBLIC_API_BASE);

  onMount(async () => {
    try {
      const res = await fetch(`${PUBLIC_API_BASE}/products/random/`);
      products = await res.json();
      console.log("取得したproducts:", products);

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
      console.error("製品データの取得に失敗しました:", error);
      isLoadingImage = false;
    }

    // --- Twitterウィジェットの読み込み ---
    // Twitterスクリプトがロードされ、レンダリングをトリガーすることを確認
    const twitterScriptId = 'twitter-wjs';
    if (!document.getElementById(twitterScriptId)) {
      const script = document.createElement("script");
      script.id = twitterScriptId; // 重複ロードを防ぐためにIDを割り当て
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => {
        // スクリプトがロードされた後、window.twttr.widgets が利用可能か確認し、タイムラインをロード
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load(document.getElementById('twitter-timeline-container'));
        } else {
          console.error("Twitter widgets not loaded or twttr object not found.");
        }
      };
      document.body.appendChild(script);
    } else {
      // スクリプトが既に存在する場合 (例: ホットリロード中)、ウィジェットをロードしてレンダリングを保証
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(document.getElementById('twitter-timeline-container'));
      }
    }

    // --- DMMウィジェットの読み込み ---
    // DMMスクリプトは、配置をアクティブにする前にDOMに存在する必要があります。
    // DMMスクリプトは、'dmm-widget-placement' クラスを持つ <ins> タグをドキュメント全体でスキャンします。
    // DMMスクリプトは一度だけロードすれば十分です。
    const dmmScriptClass = 'dmm-widget-scripts';
    if (!document.querySelector(`.${dmmScriptClass}`)) {
      const script = document.createElement('script');
      script.src = 'https://widget-view.dmm.co.jp/js/placement.js';
      script.className = dmmScriptClass;
      // スクリプト自体に data-id を設定する必要はありません。これは <ins> タグから読み取られます。
      document.body.appendChild(script);
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

  // ガチャを回す
  async function rollGacha(count) {
    const endpoint = count === 1
      ? `${PUBLIC_API_BASE}/products/random-one/`
      : `${PUBLIC_API_BASE}/products/random/`;

    try {
      const res = await fetch(endpoint);
      const result = await res.json();

      if (!res.ok) throw new Error('APIエラー');

      const params = new URLSearchParams();
      params.set('data', encodeURIComponent(JSON.stringify(result)));

      await goto(`/gacha-result?${params.toString()}`);
    } catch (err) {
      alert('ガチャ取得に失敗しました');
      console.error(err);
    }
  }
</script>

<div class="text-center p-4">
  <h1 class="text-2xl font-bold mb-4">🎰 毎日エ〇ガチャ</h1>
  <p class="mb-6">数万作品からランダムで表示(画面更新すると表示が変わります☆)</p>
  <p class="mb-6">※無料サーバーを利用している為、15分以上このサイトに一人もアクセスがないと、表示まで1分以上かかります。</p>
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
        alt="AVジャケット"
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

<ins
  class="dmm-widget-placement"
  data-id="043481a98d238feacca4c97e7b47d21b"
  style="background:transparent"
></ins>

<section class="max-w-2xl mx-auto mt-12 p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg text-gray-800">
  <h2 class="text-2xl font-bold mb-4 text-center">このサイトについて</h2>
  <p class="mb-3 leading-relaxed">
    このサイトは、DMMアフィリエイトの公式APIを活用して、毎日違ったAV作品に出会える「ガチャ機能」を提供しています。
    ボタンをクリックすると、ランダムに選ばれた作品が表示され、気になる作品は画像クリックでDMMの公式ページからすぐに購入・視聴が可能です。
  </p>
  <p class="mb-3 leading-relaxed">
    AVガチャを回すだけのサイトですが、今後もコンテンツを拡充予定です。
  </p>
  <p class="text-sm text-gray-600">
    ※ 当サイトはDMMアフィリエイトプログラムに参加しており、リンク先の商品を購入されると、運営者に報酬が発生することがあります。
  </p>
</section>

<div class="my-6 text-center" id="twitter-timeline-container">
  <a
    class="twitter-timeline"
    data-height="600"
    href="https://twitter.com/emarugacha?ref_src=twsrc%5Etfw"
  >
    Tweets by emarugacha
  </a>
</div>