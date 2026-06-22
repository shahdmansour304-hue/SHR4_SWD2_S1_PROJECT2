import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { fmtPrice } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Favorites = () => {
  const { items, remove, clear } = useFavorites();
  const { add } = useCart();

  const moveToCart = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    add(item, 1);
    remove(id);
    toast({ title: "Moved to cart", description: item.title });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 md:py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Saved</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Your Favorites
            </h1>
            <p className="mt-3 text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <span className="material-icon text-5xl text-muted-foreground">favorite_border</span>
            <p className="mt-4 text-muted-foreground">No favorites yet.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-container transition-colors"
            >
              Browse products
              <span className="material-icon text-[18px]">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-2xl bg-surface-container-low"
              >
                <Link to={`/product/${p.id}`} className="block">
                  <div className="aspect-square overflow-hidden bg-surface-bright">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                  <h3 className="mt-1.5 font-bold text-foreground line-clamp-1">{p.title}</h3>
                  <p className="mt-2 text-base font-bold text-foreground">{fmtPrice(p.price)}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => moveToCart(p.id)}
                      className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-container transition-colors"
                    >
                      Add to cart
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                      aria-label="Remove"
                    >
                      <span className="material-icon text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
