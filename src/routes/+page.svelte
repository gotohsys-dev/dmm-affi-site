<script lang="ts">
  import { onMount } from 'svelte';
  // DMM API の呼び出し部分がエラーになっているとのことなので、
  // ここではダミーデータを使うか、エラーが解決していれば実際の呼び出しに戻します。
  // import { fetchDMMItems } from '$lib/dmm'; // エラー解消後にコメントアウト解除

  // DMM API の代わりにダミーデータを使用する例
  let items = [
    {
      affiliateURL: '#', // 実際のDMMの商品URLに置き換え
      image: { small: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=商品A' },
      title: 'DMM商品Aのタイトル',
      price: '1,500円' // 価格情報も追加すると良い
    },
    {
      affiliateURL: '#',
      image: { small: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=商品B' },
      title: 'DMM商品Bのタイトル',
      price: '2,800円'
    },
    {
      affiliateURL: '#',
      image: { small: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=商品C' },
      title: 'DMM商品Cのタイトル',
      price: '3,200円'
    },
    {
      affiliateURL: '#',
      image: { small: 'https://via.placeholder.com/150/FFFF00/000000?text=商品D' },
      title: 'DMM商品Dのタイトル',
      price: '980円'
    }
  ];

  onMount(async () => {
    // もし DMM API のエラーが解決していれば、以下のように再開できます
    // items = await fetchDMMItems("おすすめ", 12);
  });
</script>

<h1 class="text-3xl font-extrabold text-center my-8 text-gray-800">おすすめ DMM 商品</h1>

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
  {#each items as item}
    <a href={item.affiliateURL} target="_blank" rel="noopener noreferrer"
       class="block bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <img src={item.image.small} alt={item.title} class="w-full h-48 object-cover object-center mb-2 rounded-t-lg" />
      <div class="p-3">
        <h2 class="text-base font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h2>
        {#if item.price}
          <p class="text-lg font-bold text-blue-600">{item.price}</p>
        {/if}
      </div>
    </a>
  {/each}
</div>

<style lang="postcss">
  /* Tailwind CSS が適用されるように app.css で設定済みであれば不要 */
  /* line-clamp は Tailwind CSS のプラグインで提供されます */
</style>