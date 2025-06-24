<!-- ✅ カードスタイルの共通コンポーネント /src/lib/Card.svelte -->
<script lang="ts">
  export let maxWidth: string = 'max-w-md';
</script>

<div class={`bg-gray-800 p-8 rounded-2xl shadow-lg text-center w-full ${maxWidth} mx-auto`}>
  <slot />
</div>