import { useEffect, useState } from "react";

export interface CartLine {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
  qty: number;
}

const KEY = "luxetech.cart";

const read = (): CartLine[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (items: CartLine[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:change"));
};

export const useCart = () => {
  const [items, setItems] = useState<CartLine[]>(() => read());

  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener("cart:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = (line: Omit<CartLine, "qty">, qty = 1) => {
    const cur = read();
    const idx = cur.findIndex((i) => i.id === line.id);
    if (idx >= 0) cur[idx].qty += qty;
    else cur.push({ ...line, qty });
    write(cur);
  };

  const update = (id: number, delta: number) => {
    const cur = read()
      .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
    write(cur);
  };

  const remove = (id: number) => write(read().filter((i) => i.id !== id));

  const clear = () => write([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return { items, add, update, remove, clear, count, subtotal };
};
