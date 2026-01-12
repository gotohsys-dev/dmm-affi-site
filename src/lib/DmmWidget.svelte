<svelte:head>
  <!--
    DMMのウィジェットスクリプトをページの<head>に一度だけ読み込みます。
    Svelteは同一のsrcを持つscriptタグの重複を自動的に防ぎます。
    スクリプトはページ上の 'dmm-widget-placement' クラスを持つすべての要素を検索して処理します。
  -->
  <script src="https://widget-view.dmm.co.jp/js/placement.js" async></script>
</svelte:head>

<script>
  /**
   * DMMウィジェットのデータID
   * @type {string}
   */
  export let dataId;
</script>

<!-- DMMウィジェットのプレースホルダー -->
<ins class="dmm-widget-placement" data-id={dataId} style="background:transparent"></ins>
