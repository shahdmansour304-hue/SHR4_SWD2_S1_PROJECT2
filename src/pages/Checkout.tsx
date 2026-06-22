import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useAccount } from "@/hooks/useAccount";
import { useOrders, type ShippingInfo } from "@/hooks/useOrders";
import { useLoyalty, POINT_VALUE, MIN_REDEEM } from "@/hooks/useLoyalty";
import { fmtPrice } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { account } = useAccount();
  const { placeOrder } = useOrders();
  const { points, earn, redeem, maxRedeemable } = useLoyalty();

  const [info, setInfo] = useState<ShippingInfo>({
    fullName: account?.name ?? "",
    email: account?.email ?? "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });
  const [payment, setPayment] = useState<"card" | "cod">("cod");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [redeemPts, setRedeemPts] = useState(0);

  const shippingFee = subtotal > 100 ? 0 : 9.99;
  const discount = redeemPts * POINT_VALUE;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const update = (k: keyof ShippingInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInfo((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const used = redeemPts > 0 ? redeem(redeemPts) : 0;
    const pointsEarned = earn(total);
    const order = placeOrder(items, info, payment, {
      discount: used,
      pointsEarned,
      pointsRedeemed: redeemPts,
    });
    clear();
    toast({
      title: "Order placed",
      description: pointsEarned
        ? `Order ${order.id} confirmed. You earned ${pointsEarned} points!`
        : `Order ${order.id} confirmed`,
    });
    navigate(`/order/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="text-3xl font-extrabold">Your cart is empty</h1>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Continue Shopping <span className="material-icon text-[18px]">arrow_forward</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const field =
    "mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-primary";
  const label = "text-xs font-bold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12 md:py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Checkout</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Complete Your Order</h1>
        </div>

        <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <section className="rounded-2xl bg-surface-container-low p-6 md:p-8">
              <h2 className="text-xl font-bold text-foreground">Shipping Information</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={label}>Full name</label>
                  <input required value={info.fullName} onChange={update("fullName")} className={field} />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input required type="email" value={info.email} onChange={update("email")} className={field} />
                </div>
                <div>
                  <label className={label}>Phone</label>
                  <input required value={info.phone} onChange={update("phone")} className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Address</label>
                  <input required value={info.address} onChange={update("address")} className={field} />
                </div>
                <div>
                  <label className={label}>City</label>
                  <input required value={info.city} onChange={update("city")} className={field} />
                </div>
                <div>
                  <label className={label}>Country</label>
                  <input required value={info.country} onChange={update("country")} className={field} />
                </div>
                <div>
                  <label className={label}>ZIP / Postal</label>
                  <input required value={info.zip} onChange={update("zip")} className={field} />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl bg-surface-container-low p-6 md:p-8">
              <h2 className="text-xl font-bold text-foreground">Payment Method</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(["cod", "card"] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setPayment(m)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      payment === m ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="material-icon text-primary">
                      {m === "card" ? "credit_card" : "payments"}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">
                        {m === "card" ? "Credit / Debit Card" : "Cash on Delivery"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m === "card" ? "Visa, Mastercard, Amex" : "Pay when you receive"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {payment === "card" && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={label}>Card number</label>
                    <input
                      required
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                      className={field}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Name on card</label>
                    <input
                      required
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      className={field}
                    />
                  </div>
                  <div>
                    <label className={label}>Expiry (MM/YY)</label>
                    <input
                      required
                      placeholder="12/27"
                      value={card.exp}
                      onChange={(e) => setCard({ ...card, exp: e.target.value })}
                      className={field}
                    />
                  </div>
                  <div>
                    <label className={label}>CVC</label>
                    <input
                      required
                      inputMode="numeric"
                      placeholder="123"
                      value={card.cvc}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                      className={field}
                    />
                  </div>
                  <p className="sm:col-span-2 text-xs text-muted-foreground">
                    Demo only — no real charge is made.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 self-start rounded-2xl bg-surface-container-low p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
            <ul className="mt-5 space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 text-sm">
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-surface-bright">
                    <img src={it.thumbnail} alt={it.title} className="h-full w-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-foreground">{it.title}</p>
                    <p className="text-xs text-muted-foreground">Qty {it.qty}</p>
                  </div>
                  <p className="font-semibold text-foreground">{fmtPrice(it.price * it.qty)}</p>
                </li>
              ))}
            </ul>

            {points >= MIN_REDEEM && (
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-icon text-primary">stars</span>
                    <p className="text-sm font-bold text-foreground">
                      Use loyalty points
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Balance: <span className="font-bold text-primary">{points}</span>
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {MIN_REDEEM} pts = {fmtPrice(MIN_REDEEM * POINT_VALUE)} off
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[0, MIN_REDEEM, Math.min(100, maxRedeemable), maxRedeemable]
                    .filter((v, i, a) => v >= 0 && a.indexOf(v) === i && (v === 0 || v <= maxRedeemable))
                    .map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRedeemPts(v)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                          redeemPts === v
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {v === 0 ? "None" : `${v} pts`}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-foreground">{fmtPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Shipping</dt>
                <dd className="font-semibold text-foreground">
                  {shippingFee === 0 ? <span className="text-primary">Free</span> : fmtPrice(shippingFee)}
                </dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <dt>Points discount</dt>
                  <dd className="font-semibold text-primary">-{fmtPrice(discount)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-5 border-t border-border pt-5 flex justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-2xl font-extrabold text-foreground">{fmtPrice(total)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              You'll earn <span className="font-bold text-primary">{Math.floor(total)} pts</span> with this order.
            </p>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-container"
            >
              Place Order
              <span className="material-icon text-[18px]">check_circle</span>
            </button>

            <Link to="/cart" className="mt-3 block text-center text-xs font-semibold text-muted-foreground hover:text-primary">
              Back to cart
            </Link>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
