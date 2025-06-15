<script>
  // onMount は、コンポーネントがブラウザにマウントされた後にコードを実行するために使用します。
  import { onMount } from 'svelte';

  // fetchDMMItems はコメントアウトされたまま、ここではダミーデータを使用します。
  // DMM API のエラーが解決したら、この行のコメントアウトを外し、onMount 内のダミーデータを削除してください。
  // import { fetchDMMItems } from '$lib/dmm'; 

  // placehold.co のURLに日本語テキストを安全に含めるための関数
  function getPlaceholderImageUrl(width, height, bgColor, textColor, text) {
    const encodedText = encodeURIComponent(text); // ここで日本語をURLエンコード
    return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
  }

  // 商品を格納するリアクティブ変数。初期値としてダミーデータを設定します。
  let items = [
    {
      affiliateURL: 'https://book.dmm.com/product/6136313/b950xshes86254/', // 実際のDMMの商品URLに置き換える
      // getPlaceholderImageUrl 関数を使用して画像を生成
      image: { small: getPlaceholderImageUrl(300, 200, 'FF5733', 'FFFFFF', 'SLAM DUNK 1') }, 
      title: '不朽の名作！感動の物語をあなたに',
      price: '627円 (税込)'
    },
    {
      affiliateURL: 'https://example.com/product-b',
      // getPlaceholderImageUrl 関数を使用して画像を生成
      image: { small: getPlaceholderImageUrl(300, 200, '33FF57', 'FFFFFF', 'Sample B') },
      title: '人気急上昇中！特別な体験が待っている',
      price: '2,980円 (税込)'
    },
    {
      affiliateURL: 'https://example.com/product-c',
      // getPlaceholderImageUrl 関数を使用して画像を生成
      image: { small: getPlaceholderImageUrl(300, 200, '3366FF', 'FFFFFF', 'Sample C') }, 
      title: '心を揺さぶる傑作！今すぐチェック',
      price: '3,500円 (税込)'
    },
    {
      affiliateURL: 'https://example.com/product-d',
      // getPlaceholderImageUrl 関数を使用して画像を生成
      image: { small: getPlaceholderImageUrl(300, 200, 'FFFF33', '000000', 'Sample D') },
      title: 'ファン必見のアイテム！限定品を見逃すな',
      price: '4,200円 (税込)'
    },
    {
      affiliateURL: 'https://example.com/product-e',
      // getPlaceholderImageUrl 関数を使用して画像を生成
      image: { small: getPlaceholderImageUrl(300, 200, 'A0A0A0', 'FFFFFF', 'Sample E') }, 
      title: '新しい趣味を見つけよう！入門に最適',
      price: '980円 (税込)'
    },
    {
      affiliateURL: 'https://placehold.co/300x200/6A0DAD/FFFFFF?text=%E5%95%86%E5%93%81F',
      // getPlaceholderImageUrl 関数を使用して画像を生成
      image: { small: getPlaceholderImageUrl(300, 200, '6A0DAD', 'FFFFFF', 'Sample F') }, 
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
    DMM お買い得商品セレクション(仮)
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

  <!-- 当サイトについてセクション -->
  <section class="max-w-4xl mx-auto my-12 p-6 bg-white rounded-xl shadow-lg">
    <h2 class="text-3xl font-extrabold text-gray-800 mb-6 text-center">当サイトについて</h2>
    <p class="text-gray-700 leading-relaxed mb-4">
      このサイトは、DMMアフィリエイトの商品を紹介するためにSvelteKitで構築されたサンプルサイトです。
      現在は、デモンストレーションとしてプレースホルダー（ダミー）の商品データを表示しておりますが、
      DMMアフィリエイトへの登録承認後、DMM WEB APIから実際に商品情報を取得し、
      より充実したコンテンツを提供していく予定です。
    </p>
    <p class="text-gray-700 leading-relaxed">
      ユーザーの皆様がDMMの多様な商品を魅力的に感じ、スムーズに興味のある商品ページへアクセスできるよう、
      使いやすく、情報が見やすいインターフェースの提供を目指しております。
    </p>
  </section>

  <!-- 問い合わせフォームセクション -->
  <section class="max-w-4xl mx-auto my-12 p-6 bg-white rounded-xl shadow-lg">
    <h2 class="text-3xl font-extrabold text-gray-800 mb-6 text-center">お問い合わせ</h2>
    <form action="#" method="POST" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">お名前</label>
        <input type="text" id="name" name="name" 
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
               placeholder="お名前を入力してください" required>
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
        <input type="email" id="email" name="email" 
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
               placeholder="メールアドレスを入力してください" required>
      </div>
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-1">お問い合わせ内容</label>
        <textarea id="message" name="message" rows="5" 
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="お問い合わせ内容を入力してください" required></textarea>
      </div>
      <div class="text-center">
        <button type="submit" 
                class="inline-flex justify-center py-2 px-6 border border-transparent 
                       shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                       transition-colors duration-200">
          送信
        </button>
      </div>
    </form>
    <p class="text-gray-600 text-xs mt-4 text-center">
      ※このフォームはサンプルです。実際には送信機能は動作しません。
    </p>
  </section>

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
