import { useEffect, useState } from "react";
import type { CartLine } from "./useCart";

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartLine[];
  shipping: ShippingInfo;
  paymentMethod: "card" | "cod";
  subtotal: number;
  shippingFee: number;
  discount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  total: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered";
}

const KEY = "luxetech.orders";

const read = (): Order[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (orders: Order[]) => {
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent("orders:change"));
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => read());

  useEffect(() => {
    const sync = () => setOrders(read());
    window.addEventListener("orders:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("orders:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const placeOrder = (
    items: CartLine[],
    shipping: ShippingInfo,
    paymentMethod: "card" | "cod",
    extras: { discount?: number; pointsEarned?: number; pointsRedeemed?: number } = {}
  ): Order => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingFee = subtotal > 100 ? 0 : 9.99;
    const discount = Math.max(0, extras.discount ?? 0);
    const total = Math.max(0, subtotal + shippingFee - discount);
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items,
      shipping,
      paymentMethod,
      subtotal,
      shippingFee,
      discount,
      pointsEarned: extras.pointsEarned ?? 0,
      pointsRedeemed: extras.pointsRedeemed ?? 0,
      total,
      status: "Confirmed",
    };
    write([order, ...read()]);
    return order;
  };

  return { orders, placeOrder, count: orders.length };
};
