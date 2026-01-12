<script>
  import { onMount } from 'svelte';

  /**
   * DMMウィジェットのデータID
   * @type {string}
   */
  export let dataId;

  let container;

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://widget-view.dmm.co.jp/js/placement.js';
    script.className = 'dmm-widget-scripts';
    script.dataset.id = dataId;
    container.appendChild(script);
  });
</script>

<!-- DMMウィジェットのプレースホルダー -->
<div bind:this={container}>
  <ins class="dmm-widget-placement" data-id={dataId} style="background:transparent"></ins>
</div>
