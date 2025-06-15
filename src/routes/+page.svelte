<script lang="ts">
  import { onMount } from 'svelte';
  // import { fetchDMMItems } from '$lib/dmm';

  let items = [];

//   onMount(async () => {
//     items = await fetchDMMItems("おすすめ", 12);
//   });
</script>

<h1 class="text-2xl font-bold mb-4">DMM 商品一覧</h1>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  {#each items as item}
    <a href={item.affiliateURL} target="_blank" class="border p-2 rounded shadow hover:shadow-lg transition">
      <img src={item.image.small} alt={item.title} class="w-full mb-2" />
      <div class="text-sm">{item.title}</div>
    </a>
  {/each}
</div>