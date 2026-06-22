import { useEffect, useState } from "react";

const KEY = "luxetech.loyalty";

// 1 point per $1 spent, each point worth $0.10 when redeemed.
export const POINT_RATE = 1;
export const POINT_VALUE = 0.1;
export const MIN_REDEEM = 50;

const read = (): number => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? Number(JSON.parse(raw)) || 0 : 0;
  } catch {
    return 0;
  }
};

const write = (n: number) => {
  localStorage.setItem(KEY, JSON.stringify(Math.max(0, Math.floor(n))));
  window.dispatchEvent(new CustomEvent("loyalty:change"));
};

export const useLoyalty = () => {
  const [points, setPoints] = useState<number>(() => read());

  useEffect(() => {
    const sync = () => setPoints(read());
    window.addEventListener("loyalty:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("loyalty:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const earn = (amountSpent: number) => {
    const earned = Math.floor(amountSpent * POINT_RATE);
    if (earned > 0) write(read() + earned);
    return earned;
  };

  const redeem = (pointsToUse: number) => {
    const available = read();
    const use = Math.min(Math.max(0, Math.floor(pointsToUse)), available);
    write(available - use);
    return use * POINT_VALUE;
  };

  const maxRedeemable = Math.floor(points / MIN_REDEEM) * MIN_REDEEM;

  return { points, earn, redeem, maxRedeemable };
};
