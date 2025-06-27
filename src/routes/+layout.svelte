
<svelte:head></svelte:head>
  <meta name="google-site-verification" content="4yiw-UxhLeEw9Ev1NyPeblxlCdODo77fSeDQkb4--O4" />
<script lang="ts">
  
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import '../app.css';

  onMount(() => {
    const confirmed = localStorage.getItem('age_confirmed');
    if (confirmed !== 'yes' && !window.location.pathname.startsWith('/age-check')) {
      goto('/age-check');
    }
  });
</script>

<!-- 全体背景・テキストカラーを統一 -->
<div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
  <slot />
</div>

<footer class="text-sm text-gray-400 text-center mt-12 pb-6">
  <a href="/privacy" class="hover:underline">プライバシーポリシー</a> |
  <a href="/terms" class="hover:underline">利用規約</a> |
  <a href="/copyright" class="hover:underline">著作権</a> |
  <a href="/contact" class="hover:underline">お問い合わせ</a>
  <div class="mt-2">© 2025 毎日エ〇ガチャ</div>
</footer>