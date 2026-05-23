<!-- ✅ /src/routes/age-check/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';

  function confirmAge() {
    localStorage.setItem('age_confirmed', 'yes');
    goto('/');
  }

  function denyAccess() {
    window.location.href = 'https://www.google.co.jp/';
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
  <div class="bg-gray-800 p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
    <h1 class="text-3xl font-bold mb-4">🔞 年齢確認</h1>
    <p class="mb-4 text-sm text-gray-300">このサイトには成人向けコンテンツが含まれています。</p>
    <p class="mb-6 text-lg font-semibold">あなたは18歳以上ですか？</p>
    <div class="flex justify-center gap-6">
      <button
        class="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-bold transition"
        on:click={confirmAge}
      >
        はい
      </button>
      <button
        class="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-white transition"
        on:click={denyAccess}
      >
        いいえ
      </button>
    </div>
  </div>
</div>
