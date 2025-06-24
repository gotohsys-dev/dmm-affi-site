<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';

  let products = [];
  let currentIndex = 0;

onMount(async () => {
  const res = await fetch("http://localhost:8000/api/products/random/");
  products = await res.json();
  console.log("取得したproducts:", products); // ✅ここ
  rotate();
});

  function rotate() {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % products.length;
    }, 1500); // 1.5秒ごとに切り替え
  }
</script>

{#if products.length > 0}
  <div class="text-center p-4">
    <h1 class="text-2xl font-bold mb-4">🎰 毎日AVガチャ</h1>
     <p class="mb-6">数万作品からランダムで表示(画面更新で表示がかわるよ☆)</p>
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
    class="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow"
  >
    🎯 ガチャを回す
  </button>
</div>