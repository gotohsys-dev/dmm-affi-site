<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';

  let products = [];
  let currentIndex = 0;

  onMount(async () => {
    const res = await fetch("http://localhost:8000/api/products/random/");
    // const res = await fetch("https://django-backend-1-ikcz.onrender.com/api/products/random/");
    products = await res.json();
    console.log("取得したproducts:", products); // ✅ここ
    rotate();
  });

  // 作品ルーレット
  function rotate() {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % products.length;
    }, 1500); // 1.5秒ごとに切り替え
  }

  // ガチャを回す
  async function rollGacha(count: number) {
    const endpoint = count === 1
      ? 'http://localhost:8000/api/products/random-one/'
      : 'http://localhost:8000/api/products/random/';

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
  <h1 class="text-2xl font-bold mb-4">🎰 毎日AVガチャ</h1>
  <p class="mb-6">数万作品からランダムで表示(画面更新すると表示が変わります☆)</p>
</div>

{#if products.length > 0}
  <div class="text-center p-4">
    <a href={products[currentIndex].affiliate_url} target="_blank" rel="noopener">
      <img
      src={products[currentIndex].image_url}
      alt="AVジャケット"
      class="mx-auto object-contain w-[512px] h-[384px] max-w-full rounded-lg shadow"
      />
    </a>
    <!-- <p class="mt-2 font-semibold">{products[currentIndex].title}</p> -->
  </div>
{/if}

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
    「今日はどんな作品に出会えるかな？」というワクワク感を楽しんでいただけるよう、今後もコンテンツを拡充予定です。
  </p>
  <p class="text-sm text-gray-600">
    ※ 当サイトはDMMアフィリエイトプログラムに参加しており、リンク先の商品を購入されると、運営者に報酬が発生することがあります。
  </p>
</section>