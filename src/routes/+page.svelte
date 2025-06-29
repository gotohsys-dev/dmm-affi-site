<script>
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { PUBLIC_API_BASE } from '$env/static/public';

  let products = [];
  let currentIndex = 0;
  let twitterLoaded = true; // Twitterウィジェットの表示は今回は触りません
  let isLoadingImage = true; // ★画像読み込み中の状態を追加

  console.log("PUBLIC_API_BASE:", PUBLIC_API_BASE);

  onMount(async () => {
    try {
      const res = await fetch("https://django-backend-1-ikcz.onrender.com/api/products/random/");
      products = await res.json();
      console.log("取得したproducts:", products);

      // ★画像のロードが完了したら isLoadingImage を false にする
      if (products.length > 0) {
        // 現在の画像のロードを監視するためのImageオブジェクトを作成
        const img = new Image();
        img.src = products[currentIndex].image_url;
        img.onload = () => {
          isLoadingImage = false; // 画像がロードされたらfalseにする
          rotate(); // 画像が表示されてからルーレットを開始
        };
        img.onerror = () => {
          console.error("画像のロードに失敗しました:", products[currentIndex].image_url);
          isLoadingImage = false; // エラーでも表示を解除
          rotate(); // エラーでもルーレットを開始
        };
      } else {
        isLoadingImage = false; // 製品がない場合は即座に解除
      }

    } catch (error) {
      console.error("製品データの取得に失敗しました:", error);
      isLoadingImage = false; // エラーが発生しても解除
    }

    // Twitterウィジェットのスクリプトを読み込む (既存のロジック)
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.onload = () => {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(document.getElementById('twitter-timeline-container'));
      } else {
        console.error("Twitter widgets not loaded or twttr object not found.");
      }
    };
    document.body.appendChild(script);
  });

  // 作品ルーレット
  function rotate() {
    // ★画像ロード後にルーレットが開始されるように、onMount内のimg.onloadに移動しました
    setInterval(() => {
      currentIndex = (currentIndex + 1) % products.length;
      isLoadingImage = true; // ★画像が切り替わるたびに、再度ローディング状態にする
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
    }, 1500); // 1.5秒ごとに切り替え
  }

  // ガチャを回す (変更なし)
  async function rollGacha(count) {
    const endpoint = count === 1
      ? 'https://django-backend-1-ikcz.onrender.com/api/products/random-one/'
      : 'https://django-backend-1-ikcz.onrender.com/api/products/random/';

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
  <p class="mb-6">※無料サーバーを利用している為、15分以上このサイトにアクセスがないと、表示まで1分以上かかります。</p>
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
    on:click={() => goto('/gacha-result')}
    class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
  >
    ガチャを回す
  </button>

  <button
    on:click={() => goto('/gacha-result?bulk=10')}
    class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
  >
    10連ガチャ
  </button>
</div>

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