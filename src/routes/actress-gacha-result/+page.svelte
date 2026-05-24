<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let actress = null;
  let loading = true;
  let error = null;

  async function fetchActress() {
    loading = true;
    error = null;
    try {
      // urls.py の設定に合わせて fetch を行います
      const response = await fetch('/api/actress/random-one/');
      if (!response.ok) {
        throw new Error('女優データの取得に失敗しました');
      }
      actress = await response.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  onMount(fetchActress);
</script>

<div class="flex flex-col items-center min-h-screen bg-gray-100 p-4 pb-12">
  {#if loading}
    <div class="mt-20 flex flex-col items-center text-gray-500">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
      <p class="font-medium">運命の出会いを検索中...</p>
    </div>
  {:else if error}
    <div class="mt-20 bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full border border-red-100">
      <div class="text-red-500 text-5xl mb-4">⚠️</div>
      <p class="text-gray-700 mb-6">{error}</p>
      <button on:click={fetchActress} class="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition">
        もう一度試す
      </button>
    </div>
  {:else if actress}
    <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden mt-4 mb-8 border border-gray-200">
      <!-- 画像エリア -->
      <div class="relative aspect-[3/4] bg-gray-200">
        <img 
          src={actress.image_url} 
          alt={actress.name} 
          class="w-full h-full object-cover"
        />
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 text-white">
          <p class="text-xs font-semibold tracking-wider text-pink-300 opacity-90 uppercase mb-1">{actress.ruby || ''}</p>
          <h2 class="text-3xl font-black leading-tight">{actress.name}</h2>
        </div>
      </div>

      <!-- プロフィール詳細 -->
      <div class="p-6 space-y-5">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-pink-50 p-3 rounded-2xl border border-pink-100">
            <span class="text-[10px] font-bold text-pink-400 uppercase tracking-tighter block mb-1">Height</span>
            <span class="text-lg font-bold text-gray-800">{actress.height ? `${actress.height}cm` : '--'}</span>
          </div>
          <div class="bg-pink-50 p-3 rounded-2xl border border-pink-100">
            <span class="text-[10px] font-bold text-pink-400 uppercase tracking-tighter block mb-1">Blood Type</span>
            <span class="text-lg font-bold text-gray-800">{actress.blood_type ? `${actress.blood_type}型` : '--'}</span>
          </div>
          <div class="col-span-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-1">Three Sizes & Cup</span>
            <span class="text-lg font-bold text-gray-800">
              B:{actress.bust || '-'} <span class="text-pink-500">({actress.cup || '-'})</span> W:{actress.waist || '-'} H:{actress.hip || '-'}
            </span>
          </div>
          <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-1">Birthday</span>
            <span class="font-bold text-gray-700 text-sm">{actress.birthday || '未登録'}</span>
          </div>
          <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-1">From</span>
            <span class="font-bold text-gray-700 text-sm">{actress.prefectures || '不明'}</span>
          </div>
        </div>

        {#if actress.hobby}
          <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-1">Hobby</span>
            <p class="text-sm text-gray-700 leading-relaxed">{actress.hobby}</p>
          </div>
        {/if}

        <!-- アフィリエイトリンク -->
        <div class="grid grid-cols-1 gap-2 pt-2">
          {#if actress.list_url_digital}
            <a href={actress.list_url_digital} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md">
              動画作品
            </a>
          {/if}
          {#if actress.list_url_monthly}
            <a href={actress.list_url_monthly} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md">
              月額見放題
            </a>
          {/if}
          {#if actress.list_url_mono}
            <a href={actress.list_url_mono} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md">
              通販 / DVD
            </a>
          {/if}
        </div>

        <div class="pt-4 flex flex-col gap-3">
          <button on:click={fetchActress} class="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl hover:opacity-90 transition shadow-lg text-lg">
            もう一度ガチャを回す
          </button>
          <a href="{base}/actress" class="text-center text-gray-400 text-sm hover:text-pink-500 transition font-medium">ガチャトップへ戻る</a>
        </div>
      </div>
    </div>
  {/if}
</div>