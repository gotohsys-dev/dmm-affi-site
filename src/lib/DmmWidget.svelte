<script>
  import { onMount } from 'svelte';

  export let dataId;
  let container;

  onMount(() => {
    // 既にスクリプトが読み込まれているかチェック
    const existingScript = document.querySelector('script.dmm-widget-scripts-main');

    if (!existingScript) {
      // 初回のみメインスクリプトを読み込む
      const script = document.createElement('script');
      script.src = "https://widget-view.dmm.co.jp/js/placement.js";
      script.className = 'dmm-widget-scripts-main';
      script.async = true;
      document.head.appendChild(script);
    } else {
      // 既にスクリプトが存在する場合、DMMの関数を再実行してウィジェットを描画させる
      // ※ DMMのスクリプトがグローバルに render 関数などを展開している場合
      if (window.DMM && window.DMM.widget && window.DMM.widget.render) {
        window.DMM.widget.render();
      }
    }
  });
</script>

<div bind:this={container} class="dmm-widget-wrapper">
  <ins
    class="dmm-widget-placement"
    data-id={dataId}
    style="background:transparent; display:inline-block;"
  ></ins>
</div>