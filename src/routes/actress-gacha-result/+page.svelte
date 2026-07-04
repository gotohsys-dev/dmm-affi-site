<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { PUBLIC_API_BASE } from '$env/static/public';
  import DmmWidget from '$lib/DmmWidget.svelte';
  import Card from '$lib/Card.svelte';
  import { favoritesStore, toggleFavorite } from '$lib/favorites';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';

  let actress = null;
  let actresses = [];
  let loading = true;
  let products = [];
  let error = null;
  let isBulk = false;

  async function fetchActresses() {
    loading = true;
    error = null;
    try {
      const { url } = get(page);
      isBulk = url.searchParams.get('bulk') === '10';

      const endpoint = isBulk
        ? `${PUBLIC_API_BASE}/actress/random/`
        : `${PUBLIC_API_BASE}/actress/random-one/`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('女優データの取得に失敗しました');
      }
      const data = await response.json();

      if (isBulk) {
        actresses = Array.isArray(data) ? data : [data];
        actress = null;
        products = [];
      } else {
        actress = data;
        actresses = [data];

        // 女優の作品を取得
        const productRes = await fetch(`${PUBLIC_API_BASE}/actress/products/?name=${encodeURIComponent(actress.name)}`);
        products = await productRes.json();
      }

    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  onMount(fetchActresses);

  const handleRetry = () => {
    actress = null;
    actresses = [];
    products = [];
    fetchActresses();
  };

  const handleToggleActressFav = (act) => {
    toggleFavorite({
      id: act.name,
      type: 'actress',
      title: act.name,
      image_url: act.image_url,
      ruby: act.ruby,
      list_url_digital: act.list_url_digital
    });
  };

  const handleToggleProductFav = (product) => {
    toggleFavorite({
      id: product.affiliate_url,
      type: 'av',
      title: product.title,
      image_url: product.image_url,
      rarity: product.rarity,
      is_sale: product.is_sale
    });
  };

  $: isActressFav = (act) => act && $favoritesStore.some(fav => fav.id === act.name && fav.type === 'actress');
  $: isProductFav = (prod) => prod && $favoritesStore.some(fav => fav.id === prod.affiliate_url && fav.type === 'av');
</script>

<div class="text-center p-4">
  <h1 class="text-2xl font-bold mb-4">🎯 ガチャ結果</h1>
</div>

<div class="max-w-4xl mx-auto p-4">
  {#if loading}
    <div class="text-center py-20">
      <p class="text-xl text-gray-500">抽選中...</p>
    </div>
  {:else if error}
    <div class="text-center py-20 bg-white rounded-lg shadow">
      <p class="text-red-500 mb-4">{error}</p>
      <button on:click={handleRetry} class="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition">
        もう一度試す
      </button>
    </div>
  {:else if !isBulk && actress}
    <!-- 1回ガチャ詳細表示 -->
    <div class="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 flex flex-col md:flex-row text-white">
      <!-- 左側：画像 -->
      <div class="md:w-1/2 bg-gray-900">
        <img 
          src={actress.image_url} 
          alt={actress.name} 
          class="w-full h-full object-contain max-h-[500px]"
        />
      </div>

      <!-- 右側：プロフィール -->
      <div class="md:w-1/2 p-6 flex flex-col justify-between">
        <div>
          <p class="text-sm text-pink-500 font-bold">{actress.ruby || ''}</p>
          <h2 class="text-3xl font-bold mb-4">{actress.name}</h2>
          
          <ul class="space-y-2 text-gray-300 border-t border-b border-gray-700 py-4 mb-4">
            <li><strong>身長:</strong> {actress.height ? `${actress.height}cm` : '不明'}</li>
            <li><strong>血液型:</strong> {actress.blood_type ? `${actress.blood_type}型` : '不明'}</li>
            <li><strong>スリーサイズ:</strong> B:{actress.bust || '-'}({actress.cup || '-'}) W:{actress.waist || '-'} H:{actress.hip || '-'}</li>
            <li><strong>生年月日:</strong> {actress.birthday || '不明'}</li>
            <li><strong>出身地:</strong> {actress.prefectures || '不明'}</li>
            <li><strong>趣味:</strong> {actress.hobby || 'なし'}</li>
          </ul>
        </div>

        <div class="space-y-2">
            <!-- お気に入りボタン -->
            <button
              on:click={() => handleToggleActressFav(actress)}
              class="w-full text-center py-2 rounded font-bold transition shadow
                {isActressFav(actress) ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-yellow-500'}"
            >
              {isActressFav(actress) ? '★ 女優をお気に入り解除' : '☆ 女優をお気に入り登録'}
            </button>
            {#if actress.list_url_digital}
              <a href={actress.list_url_digital} target="_blank" class="block w-full text-center bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">動画作品を見る</a>
            {/if}
            {#if actress.list_url_monthly}
              <a href={actress.list_url_monthly} target="_blank" class="block w-full text-center bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">月額作品を見る</a>
            {/if}
            {#if actress.list_url_mono}
              <a href={actress.list_url_mono} target="_blank" class="block w-full text-center bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600">通販・DVDを見る</a>
            {/if}
          </div>
      </div>
    </div>

    <!-- 作品ガチャ結果 -->
    <div class="mt-12">
      <h3 class="text-xl font-bold mb-6 text-center">🎥 {actress.name} の出演作品ガチャ結果</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {#each products as product}
          <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-100 flex flex-col">
            <a href={product.affiliate_url} target="_blank" rel="noopener" class="relative group">
              <img src={product.image_url} alt={product.title} class="w-full h-48 object-cover group-hover:opacity-90 transition" />
              <div class="absolute top-0 right-0 m-1">
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold text-white shadow-sm 
                  {product.rarity === 'Uレア' ? 'bg-red-500' : 
                   product.rarity === 'Sレア' ? 'bg-orange-500' : 
                   product.rarity === 'レア' ? 'bg-blue-500' : 'bg-gray-500'}">
                  {product.rarity}
                </span>
              </div>
            </a>
            <div class="p-2 flex-grow flex flex-col justify-between">
              <p class="text-[10px] text-gray-600 line-clamp-2 h-8 mb-1">
                {#if product.is_sale}
                  <span class="text-red-500 font-bold">【セール中】</span>
                {/if}
                {product.title}
              </p>

              <!-- お気に入りボタン -->
              <button
                on:click={() => handleToggleProductFav(product)}
                class="mt-2 w-full text-center py-1 rounded text-[10px] font-bold transition shadow-sm
                  {isProductFav(product) ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'}"
              >
                {isProductFav(product) ? '★ お気に入り解除' : '☆ お気に入り追加'}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="mt-8 text-center space-x-4">
      <button
        on:click={handleRetry}
        class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded shadow"
      >
        もう一度回す
      </button>
      <a
        href="{base}/actress"
        class="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded shadow"
      >
        トップに戻る
      </a>
    </div>
  {:else if isBulk && actresses.length > 0}
    <!-- 10連ガチャグリッド表示 -->
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {#each actresses as act}
        <Card maxWidth="max-w-xs">
          <div class="flex flex-col h-full justify-between">
            <div class="relative overflow-hidden rounded-lg mb-3">
              <img
                src={act.image_url}
                alt={act.name}
                class="mx-auto object-contain w-full h-48 rounded-lg shadow transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <div class="flex-grow flex flex-col justify-between">
              <div>
                <p class="text-[10px] text-pink-500 font-bold">{act.ruby || ''}</p>
                <h3 class="text-base font-bold mb-2 text-white">{act.name}</h3>
                
                <ul class="text-[10px] text-gray-300 space-y-0.5 border-t border-b border-gray-700 py-2 mb-3">
                  <li><strong>身長:</strong> {act.height ? `${act.height}cm` : '不明'}</li>
                  <li><strong>サイズ:</strong> B:{act.bust || '-'}({act.cup || '-'}) W:{act.waist || '-'} H:{act.hip || '-'}</li>
                </ul>
              </div>

              <div>
                <!-- お気に入りボタン -->
                <button
                  on:click={() => handleToggleActressFav(act)}
                  class="w-full text-center py-1.5 rounded text-xs font-bold transition shadow-sm
                    {isActressFav(act) ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-yellow-500'}"
                >
                  {isActressFav(act) ? '★ お気に入り解除' : '☆ お気に入り追加'}
                </button>

                <!-- アフィリンクボタン -->
                <div class="flex gap-1 mt-2">
                  {#if act.list_url_digital}
                    <a href={act.list_url_digital} target="_blank" class="flex-1 text-center bg-blue-600 text-white py-1.5 rounded text-[10px] font-bold hover:bg-blue-700">動画</a>
                  {/if}
                  {#if act.list_url_monthly}
                    <a href={act.list_url_monthly} target="_blank" class="flex-1 text-center bg-green-600 text-white py-1.5 rounded text-[10px] font-bold hover:bg-green-700">月額</a>
                  {/if}
                  {#if act.list_url_mono}
                    <a href={act.list_url_mono} target="_blank" class="flex-1 text-center bg-orange-500 text-white py-1.5 rounded text-[10px] font-bold hover:bg-orange-600">通販</a>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </Card>
      {/each}
    </div>

    <div class="mt-8 text-center space-x-4">
      <button
        on:click={handleRetry}
        class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded shadow"
      >
        もう一度10連を回す
      </button>
      <a
        href="{base}/actress"
        class="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded shadow"
      >
        トップに戻る
      </a>
    </div>
  {/if}
</div>

<div class="my-12 flex justify-center">
  <DmmWidget dataId="7466dd6057bbc4243631a4b74a3580da" />
</div>

<style>
  /* メインページの雰囲気に合わせた最小限のスタイル */
  :global(body) {
    background-color: #f9fafb; /* bg-gray-50 相当の色 */
  }
</style>