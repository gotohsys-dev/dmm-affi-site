<script lang="ts">
	import { favoritesStore, toggleFavorite, type FavoriteItem } from '$lib/favorites';
	import Card from '$lib/Card.svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	// フィルタ状態
	let activeFilter: 'all' | 'av' | 'video' | 'book' | 'doujin' | 'actress' = 'all';

	// フィルタリングされたお気に入りリスト
	$: filteredFavorites = $favoritesStore
		.filter((item) => activeFilter === 'all' || item.type === activeFilter)
		.sort((a, b) => b.added_at - a.added_at); // 新しい順に並び替え

	// お気に入り解除
	const handleRemove = (item: FavoriteItem) => {
		toggleFavorite(item);
	};

	const getTypeName = (type: string) => {
		switch (type) {
			case 'av':
				return 'AV';
			case 'doujin':
				return '同人';
			case 'book':
				return '電子書籍';
			case 'actress':
				return '女優';
			//   case 'video': return '動画';
			//   default: return 'その他';
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'av':
				return 'bg-pink-600';
			case 'doujin':
				return 'bg-purple-600';
			case 'book':
				return 'bg-green-600';
			case 'actress':
				return 'bg-red-500';
			//   case 'video': return 'bg-blue-600';
			//   default: return 'bg-gray-600';
		}
	};
</script>

<svelte:head>
	<title>お気に入り一覧 | 毎日エ〇ガチャ</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-10 text-white md:px-8"
>
	<div class="mx-auto max-w-7xl">
		<!-- ヘッダー -->
		<div class="mb-10 text-center">
			<h1
				class="mb-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent"
			>
				⭐️ お気に入り一覧
			</h1>
			<p class="text-sm text-gray-400 md:text-base">
				ガチャで気になった商品や女優をまとめてチェックできます。
			</p>
		</div>

		<!-- フィルタータブ -->
		<div
			class="mx-auto mb-8 flex max-w-2xl flex-wrap justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900/60 p-2 backdrop-blur-md"
		>
			<button
				on:click={() => (activeFilter = 'all')}
				class="rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200
          {activeFilter === 'all'
					? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				すべて ({$favoritesStore.length})
			</button>
			<button
				on:click={() => (activeFilter = 'av')}
				class="rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200
          {activeFilter === 'av'
					? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				AV ({$favoritesStore.filter((i) => i.type === 'av').length})
			</button>
			<button
				on:click={() => (activeFilter = 'video')}
				class="rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200
          {activeFilter === 'video'
					? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				動画 ({$favoritesStore.filter((i) => i.type === 'video').length})
			</button>
			<button
				on:click={() => (activeFilter = 'book')}
				class="rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200
          {activeFilter === 'book'
					? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				電子書籍 ({$favoritesStore.filter((i) => i.type === 'book').length})
			</button>
			<button
				on:click={() => (activeFilter = 'doujin')}
				class="rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200
          {activeFilter === 'doujin'
					? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				同人 ({$favoritesStore.filter((i) => i.type === 'doujin').length})
			</button>
			<button
				on:click={() => (activeFilter = 'actress')}
				class="rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200
          {activeFilter === 'actress'
					? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
					: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				女優 ({$favoritesStore.filter((i) => i.type === 'actress').length})
			</button>
		</div>

		<!-- お気に入りリスト -->
		{#if filteredFavorites.length === 0}
			<div
				class="mx-auto max-w-xl rounded-2xl border border-gray-800/80 bg-gray-900/40 py-20 text-center backdrop-blur-sm"
				in:fade
			>
				<span class="mb-4 block text-5xl">💨</span>
				<h3 class="mb-2 text-xl font-bold">お気に入りがありません</h3>
				<p class="mb-6 text-sm text-gray-500">気になるガチャを回してお気に入りを見つけましょう！</p>
				<div class="mx-auto flex max-w-xs flex-col gap-2">
					<a
						href="/"
						class="rounded-xl bg-pink-600 px-4 py-2.5 font-bold text-white transition hover:bg-pink-700"
						>🎯 AVガチャを回す</a
					>
					<a
						href="/videos"
						class="rounded-xl bg-blue-600 px-4 py-2.5 font-bold text-white transition hover:bg-blue-700"
						>🎬 動画ガチャを回す</a
					>
					<a
						href="/fanzabook"
						class="rounded-xl bg-green-600 px-4 py-2.5 font-bold text-white transition hover:bg-green-700"
						>📖 電子書籍ガチャを回す</a
					>
					<a
						href="/dojin"
						class="rounded-xl bg-purple-600 px-4 py-2.5 font-bold text-white transition hover:bg-purple-700"
						>💋 同人ガチャを回す</a
					>
					<a
						href="/actress"
						class="rounded-xl bg-red-500 px-4 py-2.5 font-bold text-white transition hover:bg-red-600"
						>💃 女優ガチャを回す</a
					>
				</div>
			</div>
		{:else}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filteredFavorites as item (item.id + item.type)}
					<div animate:flip={{ duration: 300 }} out:fade={{ duration: 200 }} class="flex">
						<Card maxWidth="w-full">
							<div class="relative flex h-full flex-col justify-between">
								<!-- カテゴリバッジ & 削除ボタン -->
								<div class="absolute top-2 left-2 z-10">
									<span
										class="rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md {getTypeColor(
											item.type
										)}"
									>
										{getTypeName(item.type)}
									</span>
								</div>
								<div class="absolute top-2 right-2 z-10">
									<button
										on:click={() => handleRemove(item)}
										class="rounded-full bg-black/60 p-1.5 text-white shadow-md transition duration-200 hover:bg-red-600 hover:text-white"
										title="お気に入りから削除"
										aria-label="お気に入りから削除"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											class="h-4 w-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
											/>
										</svg>
									</button>
								</div>

								<!-- メディア（画像または動画 iframe） -->
								<div
									class="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-gray-900/60"
								>
									{#if item.type === 'video' && item.video_url}
										<iframe
											src={item.video_url}
											class="h-full w-full rounded-lg"
											frameborder="0"
											allow="autoplay; encrypted-media"
											allowfullscreen
											title={item.title}
										></iframe>
									{:else if item.image_url}
										<!-- svelte-ignore a11y-missing-attribute -->
										<a
											href={item.id}
											target="_blank"
											rel="sponsored"
											class="group block h-full w-full"
										>
											<img
												src={item.image_url}
												alt={item.title}
												class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
											/>
										</a>
									{:else}
										<span class="text-4xl text-gray-700">🎬</span>
									{/if}
								</div>

								<!-- 詳細情報 -->
								<div class="flex flex-grow flex-col justify-between">
									<div>
										{#if item.ruby}
											<p class="mb-1 text-[10px] font-bold text-pink-500">{item.ruby}</p>
										{/if}

										<!-- svelte-ignore a11y-missing-attribute -->
										<a href={item.id} target="_blank" rel="sponsored">
											<h4
												class="mb-2 line-clamp-2 h-10 text-sm font-semibold transition hover:text-red-400"
											>
												{item.title}
											</h4>
										</a>

										<!-- レア度バッジ -->
										{#if item.rarity}
											<span
												class="mb-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold
                        {item.rarity === 'Uレア'
													? 'bg-red-500 text-white'
													: item.rarity === 'Sレア'
														? 'bg-orange-500 text-white'
														: item.rarity === 'レア'
															? 'bg-blue-500 text-white'
															: 'bg-gray-700 text-gray-300'}"
											>
												{item.rarity}
											</span>
										{/if}

										<!-- セール中表示 -->
										{#if item.is_sale}
											<span
												class="mb-3 ml-1 inline-block rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white"
											>
												セール中
											</span>
										{/if}

										<!-- 著者/出版社 (電子書籍用) -->
										{#if item.author || item.maker}
											<div
												class="mb-3 space-y-0.5 border-t border-gray-800 pt-2 text-[10px] text-gray-400"
											>
												{#if item.author}<p class="truncate">著者: {item.author}</p>{/if}
												{#if item.maker}<p class="truncate">出版社: {item.maker}</p>{/if}
											</div>
										{/if}
									</div>

									<!-- リンクボタン -->
									<div class="mt-4">
										{#if item.type === 'actress'}
											<div class="flex flex-col gap-1">
												<a
													href={item.id}
													target="_blank"
													class="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-center text-xs font-bold text-white transition hover:from-blue-700 hover:to-indigo-700"
												>
													💋 作品を見る
												</a>
											</div>
										{:else}
											<a
												href={item.id}
												target="_blank"
												rel="sponsored"
												class="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-pink-600 to-red-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-pink-700 hover:to-red-700"
											>
												<span>🔥 FANZAで見る</span>
												<span class="ml-1 text-[10px]">↗</span>
											</a>
										{/if}
									</div>
								</div>
							</div>
						</Card>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
