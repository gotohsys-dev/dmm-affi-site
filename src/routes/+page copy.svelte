<script>
  // onMount は、コンポーネントがブラウザにマウントされた後にコードを実行するために使用します。
  import { onMount } from 'svelte';

  // fetchDMMItems はコメントアウトされたまま、ここではダミーデータを使用します。
  // DMM API のエラーが解決したら、この行のコメントアウトを外し、onMount 内のダミーデータを削除してください。
  // import { fetchDMMItems } from '$lib/dmm'; 

  // 商品を格納するリアクティブ変数。初期値としてダミーデータを設定します。
  let items = [
    {
      affiliateURL: 'https://example.com/product-a', // 実際のDMMの商品URLに置き換える
      image: { small: 'https://placehold.co/300x200/FF5733/FFFFFF?text=商品A' },
      title: '最新のヒット作！感動の物語をあなたに',
      price: '1,980円 (税込)'
    },
    {
      affiliateURL: 'https://example.com/product-b',
      image: { small: 'https://placehold.co/300x200/33FF57/FFFFFF?text=商品B' },
      title: '人気急上昇中！特別な体験が待っている',
      price: '2,980円 (税込)'
    },
    {
      affiliateURL: 'https://example.com/product-c',
      image: { small: 'https://placehold.co/300x200/3366FF/FFFFFF?text=商品C' }, // ここを修正しました
      title: '心を揺さぶる傑作！今すぐチェック',
      price: '3,500円 (税込)'
    },
    {
      affiliateURL: 'https://example.com/product-d',
      image: { small: 'https://placehold.co/300x200/FFFF33/000000?text=商品D' },
      title: 'ファン必見のアイテム！限定品を見逃すな',
      price: '4,200円 (税込)'
    },
    {
      affiliateURL: 'https://placehold.co/300x200/A0A0A0/FFFFFF?text=商品E', // ここにコンマを追加し、次の行でimageプロパティを追加
      image: { small: 'https://placehold.co/300x200/A0A0A0/FFFFFF?text=商品E' }, // この行を追加
      title: '新しい趣味を見つけよう！入門に最適',
      price: '980円 (税込)'
    },
    {
      affiliateURL: 'https://placehold.co/300x200/6A0DAD/FFFFFF?text=商品F',
      image: { small: 'https://placehold.co/300x200/6A0DAD/FFFFFF?text=商品F' },
      title: '週末を充実させる！楽しいエンターテイメント',
      price: '1,200円 (税込)'
    }
  ];

  // コンポーネントがマウントされた時に実行される非同期関数
  onMount(async () => {
    // DMM API のエラーが解決し、実際のデータを取得したい場合は、以下のコメントアウトを解除してください。
    // items = await fetchDMMItems("おすすめ", 12);
  });
</script>

<!-- ページのメインコンテナ -->
<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-inter">
  <!-- サイトのタイトル -->
  <h1 class="text-4xl font-extrabold text-center my-8 text-gray-800 tracking-tight">
    DMM お買い得商品セレクション
  </h1>

  <!-- 商品一覧のグリッドコンテナ -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
    <!-- 各商品をループで表示 -->
    {#each items as item (item.affiliateURL)} <!-- key として affiliateURL を使用 -->
      <!-- 個々の商品カードへのリンク -->
      <a href={item.affiliateURL} target="_blank" rel="noopener noreferrer"
         class="group block bg-white border border-gray-200 rounded-xl shadow-lg 
                overflow-hidden transition-all duration-300 transform 
                hover:-translate-y-2 hover:shadow-2xl 
                focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <!-- 商品画像 -->
        <div class="w-full h-48 sm:h-56 overflow-hidden">
          <img 
            src={item.image.small} 
            alt={item.title} 
            class="w-full h-full object-cover object-center 
                   group-hover:scale-105 transition-transform duration-300 ease-in-out" 
            on:error={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/300x200/E0E0E0/808080?text=画像なし'; }}
          />
        </div>
        
        <!-- 商品情報 -->
        <div class="p-4">
          <!-- 商品タイトル -->
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
            {item.title}
          </h2>
          <!-- 価格情報 (存在する場合のみ表示) -->
          {#if item.price}
            <p class="text-lg sm:text-xl font-bold text-blue-700">
              {item.price}
            </p>
          {/if}
        </div>
      </a>
    {/each}
  </div>

  <!-- フッターやその他の情報など、必要に応じて追加 -->
  <footer class="text-center text-gray-600 mt-12 text-sm">
    <p>&copy; 2025 DMMアフィリエイト商品紹介サイト. All rights reserved.</p>
  </footer>
</div>

<style lang="postcss">
  /*
    Tailwind CSS を利用しているため、ここに直接的な CSS はあまり書きません。
    もし特定のコンポーネントにのみ適用したいカスタムスタイルがあればここに記述します。
    ここでは、Tailwind CSS の @apply ディレクティブを使って既存のスタイルを拡張することも可能です。
  */
</style>
