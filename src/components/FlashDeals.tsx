import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fmtPrice, discountedPrice } from "@/lib/api";

// Countdown anchored to next day boundary so it feels live & resets daily.
const getEndOfDay = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

const pad = (n: number) => n.toString().padStart(2, "0");

const useCountdown = () => {
  const [end] = useState(getEndOfDay);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, end - now);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { hours, minutes, seconds };
};

const FlashDeals = () => {
  const { data } = useQuery({
    queryKey: ["products", "flash-deals"],
    queryFn: () => fetchProducts({ limit: 30 }),
  });
  const { hours, minutes, seconds } = useCountdown();

  const deals = (data?.products ?? [])
    .filter((p) => p.discountPercentage >= 12)
    .slice(0, 4);

  if (deals.length === 0) return null;

  return (
    <section className="container py-16">
      <div className="rounded-3xl bg-gradient-hero p-8 md:p-12 text-primary-foreground shadow-elegant">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
              <span className="material-icon text-[16px]">bolt</span>
              Flash Deals
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
              Limited-time offers
            </h2>
            <p className="mt-2 text-primary-foreground/70 max-w-md">
              Grab them before the timer hits zero — fresh deals drop every day.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: "Hrs", value: hours },
              { label: "Min", value: minutes },
              { label: "Sec", value: seconds },
            ].map((t) => (
              <div
                key={t.label}
                className="min-w-[64px] rounded-xl bg-primary-foreground/15 px-3 py-2 text-center backdrop-blur"
              >
                <p className="text-2xl md:text-3xl font-extrabold tabular-nums">
                  {pad(t.value)}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                  {t.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((p) => {
            const price = discountedPrice(p);
            return (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group block overflow-hidden rounded-2xl bg-primary-foreground/10 backdrop-blur transition-all hover:bg-primary-foreground/15"
              >
                <div className="aspect-square overflow-hidden bg-primary-foreground/5">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 truncate">
                      {p.category}
                    </p>
                    <span className="rounded-full bg-primary-foreground text-primary text-[10px] font-extrabold px-2 py-0.5">
                      -{Math.round(p.discountPercentage)}%
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-bold line-clamp-1">{p.title}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold">{fmtPrice(price)}</span>
                    <span className="text-xs line-through opacity-60">{fmtPrice(p.price)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
