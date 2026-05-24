<script>
  import { base } from '$app/paths';
</script>

<div class="container">
  <div class="header">
    <h1>FANZAブックス ガチャ</h1>
    <p>電子書籍の海から運命の一冊を引き当てよう</p>
  </div>

  <div class="gacha-machine">
    <div class="visual">📚✨</div>
    <a href="{base}/fanzabook-gacha-result" class="gacha-button">
      ガチャを回す
    </a>
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 60px auto;
    text-align: center;
    font-family: 'Hiragino Kaku Gothic ProN', sans-serif;
  }
  .header h1 {
    color: #333;
    font-size: 2rem;
  }
  .gacha-machine {
    margin-top: 40px;
    padding: 40px;
    background: #f9f9f9;
    border-radius: 20px;
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
  }
  .visual {
    font-size: 5rem;
    margin-bottom: 30px;
  }
  .gacha-button {
    display: inline-block;
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: white;
    padding: 18px 45px;
    font-size: 1.4rem;
    font-weight: bold;
    text-decoration: none;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .gacha-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 71, 87, 0.5);
  }
</style>