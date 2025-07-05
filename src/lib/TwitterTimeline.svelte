<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  /**
   * Twitterタイムラインの完全なURL
   * @type {string}
   */
  export let href;

  /**
   * タイムラインの高さ（オプション）
   * @type {string}
   */
  export let height = '600';

  let container;

  onMount(() => {
    // このコードがブラウザ環境でのみ実行されることを保証する
    if (browser) {
      // タイムラインを描画する関数
      const renderTimeline = () => {
        // window.twttr オブジェクトが利用可能か確認
        if (window.twttr && window.twttr.widgets) {
          // 再描画時にウィジェットが重複しないよう、コンテナをクリアする
          container.innerHTML = '';
          
          // 公式のファクトリー関数を使ってタイムラインを作成
          window.twttr.widgets.createTimeline(
            {
              sourceType: 'url',
              url: href
            },
            container,
            {
              height: height,
              theme: 'light' // 'dark' にも設定可能
            }
          );
        }
      };

      // Twitterのスクリプトが既にページに存在するかチェック
      if (window.twttr) {
        renderTimeline();
      } else {
        // 存在しない場合はスクリプトを動的に作成して読み込む
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = renderTimeline; // スクリプト読み込み完了後に描画
        document.head.appendChild(script);
      }
    }
  });
</script>

<!-- タイムラインのコンテナ -->
<div bind:this={container} class="twitter-timeline-container">
  <!-- スクリプトが読み込まれるまでのフォールバックリンク -->
  <a href={href}>Tweets by {href.split('/')[3].split('?')[0]}</a>
</div>

<style>
  .twitter-timeline-container {
    /* 読み込み中のレ���アウトシフトを防ぐために最小の高さを設定 */
    min-height: 400px;
  }
</style>