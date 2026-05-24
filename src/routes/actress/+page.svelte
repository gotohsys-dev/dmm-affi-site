<script>
  import { base } from '$app/paths';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
    <h1 class="text-3xl font-black text-pink-600 mb-6">女優ガチャ</h1>
    
    <div class="mb-10">
      <div class="text-7xl mb-6">👸</div>
      <p class="text-gray-600 leading-relaxed">
        今日の運命の女優さんは誰？<br>
        プロフィール情報付きでランダムに選出します。
      </p>
    </div>

    <a 
      href="{base}/actress-gacha-result" 
      class="inline-block w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
    >
      ガチャを回す
    </a>
  </div>
</div>