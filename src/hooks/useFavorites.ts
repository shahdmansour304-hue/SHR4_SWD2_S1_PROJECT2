import { useEffect, useState } from "react";

export interface FavoriteItem {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
}

const KEY = "luxetech.favorites";

const read = (): FavoriteItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (items: FavoriteItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("favorites:change"));
};

export const useFavorites = () => {
  const [items, setItems] = useState<FavoriteItem[]>(() => read());

  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener("favorites:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favorites:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isFavorite = (id: number) => items.some((i) => i.id === id);

  const toggle = (item: FavoriteItem) => {
    const cur = read();
    const idx = cur.findIndex((i) => i.id === item.id);
    if (idx >= 0) cur.splice(idx, 1);
    else cur.push(item);
    write(cur);
  };

  const remove = (id: number) => write(read().filter((i) => i.id !== id));
  const clear = () => write([]);

  return { items, isFavorite, toggle, remove, clear, count: items.length };
};
