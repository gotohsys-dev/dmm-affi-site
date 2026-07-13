<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { PUBLIC_API_BASE } from '$env/static/public';
	import DmmWidget from '$lib/DmmWidget.svelte';
	import Card from '$lib/Card.svelte';
	import { favoritesStore, toggleFavorite } from '$lib/favorites';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	let actress = null;
	let actresses = [];
	let loading = true;
	let products = [];
	let error = null;
	let isBulk = false;

	async function fetchActresses() {
		loading = true;
		error = null;
		try {
			const { url } = get(page);
			isBulk = url.searchParams.get('bulk') === '10';

			const endpoint = isBulk
				? `${PUBLIC_API_BASE}/actress/random/`
				: `${PUBLIC_API_BASE}/actress/random-one/`;

			const response = await fetch(endpoint);
			if (!response.ok) {
				throw new Error('女優データの取得に失敗しました');
			}
			const data = await response.json();

			if (isBulk) {
				actresses = Array.isArray(data) ? data : [data];
				actress = null;
				products = [];
			} else {
				actress = data;
				actresses = [data];

				// 女優の作品を取得
				const productRes = await fetch(
					`${PUBLIC_API_BASE}/actress/products/?name=${encodeURIComponent(actress.name)}`
				);
				products = await productRes.json();
			}
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	onMount(fetchActresses);

	const handleRetry = () => {
		actress = null;
		actresses = [];
		products = [];
		fetchActresses();
	};

	const handleToggleActressFav = (act) => {
		toggleFavorite({
			id: act.name,
			type: 'actress',
			title: act.name,
			image_url: act.image_url,
			ruby: act.ruby,
			list_url_digital: act.list_url_digital
		});
	};

	const handleToggleProductFav = (product) => {
		toggleFavorite({
			id: product.affiliate_url,
			type: 'av',
			title: product.title,
			image_url: product.image_url,
			rarity: product.rarity,
			is_sale: product.is_sale
		});
	};

	$: isActressFav = (act) =>
		act && $favoritesStore.some((fav) => fav.id === act.name && fav.type === 'actress');
	$: isProductFav = (prod) =>
		prod && $favoritesStore.some((fav) => fav.id === prod.affiliate_url && fav.type === 'av');
</script>

<div class="p-4 text-center">
	<h1 class="mb-4 text-2xl font-bold">🎯 ガチャ結果</h1>
</div>

<div class="mx-auto max-w-4xl p-4">
	{#if loading}
		<div class="py-20 text-center">
			<p class="text-xl text-gray-500">抽選中...</p>
		</div>
	{:else if error}
		<div class="rounded-lg bg-white py-20 text-center shadow">
			<p class="mb-4 text-red-500">{error}</p>
			<button
				on:click={handleRetry}
				class="w-full rounded-xl bg-pink-500 py-3 font-bold text-white transition hover:bg-pink-600"
			>
				もう一度試す
			</button>
		</div>
	{:else if !isBulk && actress}
		<!-- 1回ガチャ詳細表示 -->
		<div
			class="flex flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800 text-white shadow-lg md:flex-row"
		>
			<!-- 左側：画像 -->
			<div class="bg-gray-900 md:w-1/2">
				<img
					src={actress.image_url}
					alt={actress.name}
					class="h-full max-h-[500px] w-full object-contain"
				/>
			</div>

			<!-- 右側：プロフィール -->
			<div class="flex flex-col justify-between p-6 md:w-1/2">
				<div>
					<p class="text-sm font-bold text-pink-500">{actress.ruby || ''}</p>
					<h2 class="mb-4 text-3xl font-bold">{actress.name}</h2>

					<ul class="mb-4 space-y-2 border-t border-b border-gray-700 py-4 text-gray-300">
						<li><strong>身長:</strong> {actress.height ? `${actress.height}cm` : '不明'}</li>
						<li>
							<strong>血液型:</strong>
							{actress.blood_type ? `${actress.blood_type}型` : '不明'}
						</li>
						<li>
							<strong>スリーサイズ:</strong> B:{actress.bust || '-'}({actress.cup || '-'}) W:{actress.waist ||
								'-'} H:{actress.hip || '-'}
						</li>
						<li><strong>生年月日:</strong> {actress.birthday || '不明'}</li>
						<li><strong>出身地:</strong> {actress.prefectures || '不明'}</li>
						<li><strong>趣味:</strong> {actress.hobby || 'なし'}</li>
					</ul>
				</div>

				<div class="space-y-2">
					<!-- お気に入りボタン -->
					<button
						on:click={() => handleToggleActressFav(actress)}
						class="w-full rounded py-2 text-center font-bold shadow transition
                {isActressFav(actress)
							? 'bg-yellow-500 text-black hover:bg-yellow-600'
							: 'border border-yellow-500 bg-gray-800 text-yellow-400 hover:bg-gray-700'}"
					>
						{isActressFav(actress) ? '★ 女優をお気に入り解除' : '☆ 女優をお気に入り登録'}
					</button>
					{#if actress.list_url_digital}
						<a
							href={actress.list_url_digital}
							target="_blank"
							class="block w-full rounded bg-blue-600 py-2 text-center font-bold text-white hover:bg-blue-700"
							>動画作品を見る</a
						>
					{/if}
					{#if actress.list_url_monthly}
						<a
							href={actress.list_url_monthly}
							target="_blank"
							class="block w-full rounded bg-green-600 py-2 text-center font-bold text-white hover:bg-green-700"
							>月額作品を見る</a
						>
					{/if}
					{#if actress.list_url_mono}
						<a
							href={actress.list_url_mono}
							target="_blank"
							class="block w-full rounded bg-orange-500 py-2 text-center font-bold text-white hover:bg-orange-600"
							>通販・DVDを見る</a
						>
					{/if}
				</div>
			</div>
		</div>

		<!-- 作品ガチャ結果 -->
		<div class="mt-12">
			<h3 class="mb-6 text-center text-xl font-bold">🎥 {actress.name} の出演作品ガチャ結果</h3>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
				{#each products as product}
					<div
						class="flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow"
					>
						<a href={product.affiliate_url} target="_blank" rel="noopener" class="group relative">
							<img
								src={product.image_url}
								alt={product.title}
								class="h-48 w-full object-cover transition group-hover:opacity-90"
							/>
							<div class="absolute top-0 right-0 m-1">
								<span
									class="rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm
                  {product.rarity === 'Uレア'
										? 'bg-red-500'
										: product.rarity === 'Sレア'
											? 'bg-orange-500'
											: product.rarity === 'レア'
												? 'bg-blue-500'
												: 'bg-gray-500'}"
								>
									{product.rarity}
								</span>
							</div>
						</a>
						<div class="flex flex-grow flex-col justify-between p-2">
							<p class="mb-1 line-clamp-2 h-8 text-[10px] text-gray-600">
								{#if product.is_sale}
									<span class="font-bold text-red-500">【セール中】</span>
								{/if}
								<span class="text-gray-500">
									({#if product.rank}{product.rank}位{:else}ランク外{/if})
								</span>
								{product.title}
							</p>

							<!-- お気に入りボタン -->
							<button
								on:click={() => handleToggleProductFav(product)}
								class="mt-2 w-full rounded py-1 text-center text-[10px] font-bold shadow-sm transition
                  {isProductFav(product)
									? 'bg-yellow-400 text-black hover:bg-yellow-500'
									: 'border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200'}"
							>
								{isProductFav(product) ? '★ お気に入り解除' : '☆ お気に入り追加'}
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-8 space-x-4 text-center">
			<button
				on:click={handleRetry}
				class="rounded bg-pink-600 px-6 py-2 font-bold text-white shadow hover:bg-pink-700"
			>
				もう一度回す
			</button>
			<a
				href="{base}/actress"
				data-sveltekit-reload
				class="inline-block rounded bg-gray-600 px-6 py-2 font-bold text-white shadow hover:bg-gray-700"
			>
				トップに戻る
			</a>
		</div>
	{:else if isBulk && actresses.length > 0}
		<!-- 10連ガチャグリッド表示 -->
		<div class="mt-6 grid w-full grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
			{#each actresses as act}
				<div
					class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-3 shadow-md"
				>
					<!-- 画像エリア: 横幅いっぱいに広げ、正方形（aspect-square）に固定してひょろ長さを解消 -->
					<div
						class="group relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-gray-900"
					>
						<img
							src={act.image_url}
							alt={act.name}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</div>

					<!-- 情報エリア -->
					<div class="flex flex-grow flex-col justify-between">
						<div class="mb-3">
							<p class="mb-0.5 line-clamp-1 text-[10px] font-bold text-pink-400">
								{act.ruby || ' '}
							</p>
							<h3 class="line-clamp-1 text-base font-bold text-white">{act.name}</h3>

							<ul
								class="mt-2 space-y-0.5 border-t border-b border-gray-700 py-1.5 text-[11px] text-gray-400"
							>
								<li class="flex justify-between">
									<span>身長:</span>
									<span class="text-gray-200">{act.height ? `${act.height}cm` : '不明'}</span>
								</li>
								<li class="flex justify-between">
									<span>サイズ:</span>
									<span class="text-gray-200"
										>B:{act.bust || '-'}({act.cup || '-'}) W:{act.waist || '-'}</span
									>
								</li>
							</ul>
						</div>

						<!-- ボタンエリア -->
						<div class="space-y-2">
							<!-- お気に入りボタン -->
							<button
								on:click={() => handleToggleActressFav(act)}
								class="w-full rounded-lg py-1.5 text-center text-xs font-bold transition-all
                  {isActressFav(act)
									? 'bg-yellow-500 text-black hover:bg-yellow-600'
									: 'border border-yellow-500/30 bg-gray-700 text-yellow-400 hover:bg-gray-600'}"
							>
								{isActressFav(act) ? '★ お気に入り解除' : '☆ お気に入り追加'}
							</button>

							<!-- アフィリンクボタン -->
							<div class="flex gap-1">
								{#if act.list_url_digital}
									<a
										href={act.list_url_digital}
										target="_blank"
										class="flex-1 rounded bg-blue-600 py-1.5 text-center text-[11px] font-bold text-white transition hover:bg-blue-700"
										>動画</a
									>
								{/if}
								{#if act.list_url_monthly}
									<a
										href={act.list_url_monthly}
										target="_blank"
										class="flex-1 rounded bg-green-600 py-1.5 text-center text-[11px] font-bold text-white transition hover:bg-green-700"
										>月額</a
									>
								{/if}
								{#if act.list_url_mono}
									<a
										href={act.list_url_mono}
										target="_blank"
										class="flex-1 rounded bg-orange-500 py-1.5 text-center text-[11px] font-bold text-white transition hover:bg-orange-600"
										>通販</a
									>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-8 space-x-4 text-center">
			<button
				on:click={handleRetry}
				class="rounded bg-pink-600 px-6 py-2 font-bold text-white shadow hover:bg-pink-700"
			>
				もう一度10連を回す
			</button>
			<a
				href="{base}/actress"
				data-sveltekit-reload
				class="inline-block rounded bg-gray-600 px-6 py-2 font-bold text-white shadow hover:bg-gray-700"
			>
				トップに戻る
			</a>
		</div>
	{/if}
</div>

<div class="my-12 flex justify-center">
	<DmmWidget dataId="7466dd6057bbc4243631a4b74a3580da" />
</div>

<style>
	/* メインページの雰囲気に合わせた最小限のスタイル */
	:global(body) {
		background-color: #f9fafb; /* bg-gray-50 相当の色 */
	}
</style>
