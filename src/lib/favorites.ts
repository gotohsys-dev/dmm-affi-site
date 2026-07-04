import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface FavoriteItem {
  id: string; // 一意キー（affiliate_url もしくは actress.name）
  type: 'av' | 'video' | 'book' | 'doujin' | 'actress';
  title: string;
  image_url?: string;
  video_url?: string; // 動画ガチャ用
  rarity?: string;
  is_sale?: boolean;
  author?: string; // book用
  maker?: string;  // book用
  ruby?: string;   // actress用
  list_url_digital?: string; // actress用
  added_at: number;
}

export const favoritesStore = writable<FavoriteItem[]>([]);

if (browser) {
  // 初期化時にローカルストレージからロード
  const stored = localStorage.getItem('gacha_favorites');
  if (stored) {
    try {
      favoritesStore.set(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse favorites:', e);
    }
  }

  // ストアが変更されたらローカルストレージに自動保存
  favoritesStore.subscribe((val) => {
    localStorage.setItem('gacha_favorites', JSON.stringify(val));
  });
}

// お気に入りのトグル（追加・削除）
export function toggleFavorite(item: Omit<FavoriteItem, 'added_at'>) {
  favoritesStore.update((list) => {
    const exists = list.some((i) => i.id === item.id && i.type === item.type);
    if (exists) {
      return list.filter((i) => !(i.id === item.id && i.type === item.type));
    } else {
      return [...list, { ...item, added_at: Date.now() }];
    }
  });
}
