<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let product = $state(null);
  let loading = $state(true);
  let error = $state(null);

  onMount(async () => {
    try {
      // APIのベースURLは環境に合わせて調整してください。ここでは /api/dmm/ 配下と想定
      const res = await fetch('/api/dmm/fanzabook/random-one/');
      if (!res.ok) throw new Error('作品の取得に失敗しました');
      product = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  const getRarityClass = (rarity) => {
    if (rarity === 'Uレア') return 'u-rare';
    if (rarity === 'Sレア') return 's-rare';
    if (rarity === 'レア') return 'rare';
    return 'normal';
  };
</script>

<div class="container">
  {#if loading}
    <div class="status-msg">
      <div class="spinner"></div>
      <p>ガチャを回しています...</p>
    </div>
  {:else if error}
    <div class="status-msg error">
      <p>{error}</p>
      <a href="{base}/fanzabook" class="back-link">トップに戻る</a>
    </div>
  {:else if product}
    <div class="result-card">
      <div class="rarity-badge {getRarityClass(product.rarity)}">
        {product.rarity}
      </div>

      <div class="image-container">
        <img src={product.image_url} alt={product.title} />
      </div>

      <div class="content">
        <h2 class="title">{product.title}</h2>
        
        <div class="meta">
          {#if product.author}<p><strong>著者:</strong> {product.author}</p>{/if}
          {#if product.maker}<p><strong>出版社:</strong> {product.maker}</p>{/if}
          {#if product.rank}<p><strong>ランキング:</strong> {product.rank}位</p>{/if}
        </div>

        <div class="actions">
          <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer" class="btn primary">
            商品ページへ (FANZA)
          </a>
          {#if product.tachiyomi_url}
            <a href={product.tachiyomi_url} target="_blank" rel="noopener noreferrer" class="btn secondary">
              立ち読みする
            </a>
          {/if}
          <button onclick={() => window.location.reload()} class="btn text">
            もう一度引く
          </button>
        </div>
      </div>
    </div>
    <div class="footer-actions">
      <a href="{base}/fanzabook" class="back-link">ガチャトップへ</a>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 500px;
    margin: 30px auto;
    padding: 0 15px;
    font-family: sans-serif;
  }
  .status-msg { text-align: center; margin-top: 100px; }
  .result-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    position: relative;
    border: 1px solid #eee;
  }
  .rarity-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 6px 16px;
    border-radius: 20px;
    font-weight: bold;
    color: white;
    z-index: 10;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
  .u-rare { background: linear-gradient(45deg, #f1c40f, #e67e22); }
  .s-rare { background: linear-gradient(45deg, #9b59b6, #8e44ad); }
  .rare { background: linear-gradient(45deg, #3498db, #2980b9); }
  .normal { background: #95a5a6; }

  .image-container {
    width: 100%;
    background: #f0f0f0;
    display: flex;
    justify-content: center;
  }
  .image-container img { max-width: 100%; height: auto; display: block; }

  .content { padding: 25px; }
  .title { font-size: 1.25rem; margin: 0 0 15px 0; line-height: 1.5; color: #222; }
  .meta { margin-bottom: 25px; font-size: 0.9rem; color: #666; }
  .meta p { margin: 4px 0; }

  .actions { display: flex; flex-direction: column; gap: 12px; }
  .btn {
    padding: 14px;
    border-radius: 8px;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    transition: opacity 0.2s;
    cursor: pointer;
    border: none;
  }
  .btn:hover { opacity: 0.9; }
  .primary { background: #ff4757; color: white; }
  .secondary { background: #2f3542; color: white; }
  .text { background: transparent; color: #57606f; }
  
  .footer-actions { text-align: center; margin-top: 25px; }
  .back-link { color: #57606f; text-decoration: none; font-size: 0.9rem; }
  .back-link:hover { text-decoration: underline; }
  .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #ff4757; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 15px; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>