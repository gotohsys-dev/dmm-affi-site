<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  /**
   * Your DMM affiliate ID
   * @type {string}
   */
  export let affiliate_id;

  /**
   * The ID of the banner you want to display
   * @type {string}
   */
  export let banner_id;

  let container;

  onMount(() => {
    // Ensure this code only runs in the browser
    if (browser) {
      const script = document.createElement('script');
      script.className = 'widget-banner-script';
      script.src = `https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=${affiliate_id}&banner_id=${banner_id}`;
      script.async = true;

      // Append the script to the container div
      container.appendChild(script);
    }
  });
</script>

<div bind:this={container}>
  <!-- The script will place the banner inside this element -->
  <ins class="widget-banner"></ins>
</div>
