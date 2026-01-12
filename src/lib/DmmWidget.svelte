<script>
  import { onMount } from 'svelte';

  /**
   * DMMウィジェットのデータID
   * @type {string}
   */
  export let dataId;

  let container;

  onMount(() => {
    // コンポーネントがDOMにマウントされた後にスクリプトを動的に読み込む
    const script = document.createElement('script');
    script.src = `https://widget-view.dmm.co.jp/js/placement.js?t=${Math.random()}`;
    script.className = 'dmm-widget-scripts';
    script.dataset.id = dataId;
    script.async = true;

    // scriptタグをコンポーネントのコンテナに追加する
    container.appendChild(script);

    // コンポーネントが破棄されるときにクリーンアップは不要
    // SvelteがコンテナごとDOMから削除するため、追加したscriptタグも一緒に削除される
  });
</script>

<!-- ウィジェットのコンテナ -->
<div bind:this={container}>
  <!-- DMMウィジェットのプレースホルダー -->
  <ins
    class="dmm-widget-placement"
    data-id={dataId}
    style="background:transparent"
  ></ins>
</div>
