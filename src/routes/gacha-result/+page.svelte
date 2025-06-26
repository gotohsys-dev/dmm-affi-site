<!-- ✅ ガチャ結果ページ /src/routes/gacha-result/+page.svelte -->
<script lang="ts">
  import Card from '$lib/Card.svelte';
  import { onMount } from 'svelte';

  let product = null;

  onMount(async () => {
    const res = await fetch('http://localhost:8000/api/products/random-one/');
    // const res = await fetch("https://django-backend-1-ikcz.onrender.com/api/products/random-one/");
    product = await res.json();
  });
</script>

{#if product}
  <div class="flex justify-center items-center min-h-screen">
    <Card maxWidth="max-w-lg">
      <h2 class="text-2xl font-bold mb-4">🎯 ガチャ結果</h2>

      <a href={product.affiliate_url} target="_blank" rel="sponsored">
        <img
          src={product.image_url}
          alt="AV画像"
          class="mx-auto object-contain w-[512px] h-[384px] max-w-full rounded-lg shadow mb-4"
        />
      </a>

      <p class="text-lg font-semibold mb-6">{product.title}</p>

      <a href="/" class="text-blue-400 hover:underline">🔁 トップに戻る</a>
    </Card>
  </div>
{:else}
  <div class="text-center text-white py-10">ガチャを回しています...</div>
{/if}
