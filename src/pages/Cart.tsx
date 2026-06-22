import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { fetchProducts, fmtPrice, discountedPrice } from "@/lib/api";

const Cart = () => {
  const { items, update, remove, subtotal, add } = useCart();

  const { data } = useQuery({
    queryKey: ["products", "upsell"],
    queryFn: () => fetchProducts({ limit: 4, skip: 10 }),
  });
  const upsell = data?.products ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 md:py-16">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Checkout</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Shopping Bag</h1>
          <p className="mt-3 text-muted-foreground">
            You have {items.length} {items.length === 1 ? "item" : "items"} in your cart.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-16 text-center">
                <span className="material-icon text-5xl text-muted-foreground">shopping_bag</span>
                <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Continue Shopping <span className="material-icon text-[18px]">arrow_forward</span>
                </Link>
              </div>
            )}

            {items.map((item) => (
              <article
                key={item.id}
                className="group flex gap-4 md:gap-6 rounded-2xl bg-surface-container-low p-4 md:p-6 transition-all hover:shadow-soft"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="h-28 w-28 md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-surface-bright"
                >
                  <img src={item.thumbnail} alt={item.title} loading="lazy" className="h-full w-full object-contain p-2" />
                </Link>

                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary capitalize">
                      {item.category.replace(/-/g, " ")}
                    </p>
                    <Link to={`/product/${item.id}`}>
                      <h3 className="mt-1 text-lg md:text-xl font-bold text-foreground truncate hover:text-primary">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{fmtPrice(item.price)} each</p>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => remove(item.id)}
                        aria-label="Remove"
                        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <span className="material-icon text-[18px]">delete</span>
                      </button>
                      <div className="flex items-center rounded-full border border-border bg-background">
                        <button
                          onClick={() => update(item.id, -1)}
                          className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-primary"
                          aria-label="Decrease"
                        >
                          <span className="material-icon text-[18px]">remove</span>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          onClick={() => update(item.id, 1)}
                          className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-primary"
                          aria-label="Increase"
                        >
                          <span className="material-icon text-[18px]">add</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-lg md:text-xl font-bold text-foreground">
                      {fmtPrice(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 self-start rounded-2xl bg-surface-container-low p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-foreground">{fmtPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Shipping</dt>
                <dd className="font-semibold text-primary">Free</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Tax (Calculated at checkout)</dt>
                <dd className="font-semibold text-foreground">$0.00</dd>
              </div>
            </dl>

            <div className="mt-5 flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <button className="rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-primary transition-colors">
                Apply
              </button>
            </div>

            <div className="mt-6 border-t border-border pt-5 flex justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-2xl font-extrabold text-foreground">{fmtPrice(subtotal)}</span>
            </div>

            <Link
              to="/checkout"
              aria-disabled={items.length === 0}
              onClick={(e) => items.length === 0 && e.preventDefault()}
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-container hover:gap-3 ${
                items.length === 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            >
              Proceed to Checkout
              <span className="material-icon text-[18px]">arrow_forward</span>
            </Link>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="material-icon text-[16px] text-primary">verified_user</span>
              Secure Checkout Guaranteed
            </div>
          </aside>
        </div>

        {/* Upsell */}
        {upsell.length > 0 && (
          <section className="mt-24">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">You may also like</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Complete Your Setup</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {upsell.map((p) => {
                const price = discountedPrice(p);
                return (
                  <article key={p.id} className="group rounded-2xl bg-surface-container-low p-4 transition-all hover:shadow-soft">
                    <Link to={`/product/${p.id}`} className="block aspect-square overflow-hidden rounded-xl bg-surface-bright">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{fmtPrice(price)}</p>
                      </div>
                      <button
                        onClick={() =>
                          add({
                            id: p.id,
                            title: p.title,
                            category: p.category,
                            price,
                            thumbnail: p.thumbnail,
                          })
                        }
                        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-background text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label="Add to cart"
                      >
                        <span className="material-icon text-[18px]">add</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
