<!-- ✅ /src/routes/contact/+page.svelte - お問い合わせ -->
<script>
  import Card from '$lib/Card.svelte';
</script>
<div class="flex justify-center items-center min-h-screen">
  <Card maxWidth="max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">お問い合わせ</h1>
    <p class="text-sm text-left text-gray-200 leading-relaxed mb-4">
      当サイトに関するご意見・ご質問がございましたら、以下のメールアドレスまでご連絡ください。
    </p>
    <p class="text-center text-blue-300 font-mono">
      📧 <a href="mailto:example@example.com" class="hover:underline">example@example.com</a>
    </p>
    <p class="mt-6 text-xs text-center text-gray-500">※ すべてのご連絡に対応できない場合があります。あらかじめご了承ください。</p>
  </Card>
</div>