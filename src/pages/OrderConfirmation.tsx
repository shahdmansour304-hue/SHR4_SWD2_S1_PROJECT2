import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useOrders } from "@/hooks/useOrders";
import { fmtPrice } from "@/lib/api";

const OrderConfirmation = () => {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="text-3xl font-extrabold">Order not found</h1>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12 md:py-16 max-w-3xl">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <span className="material-icon text-4xl">check_circle</span>
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Thank you, {order.shipping.fullName.split(" ")[0]}!
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your order <span className="font-semibold text-foreground">{order.id}</span> has been confirmed.
          </p>
        </div>

        <section className="mt-10 rounded-2xl bg-surface-container-low p-6 md:p-8">
          <h2 className="text-xl font-bold">Items</h2>
          <ul className="mt-5 space-y-4">
            {order.items.map((it) => (
              <li key={it.id} className="flex gap-4">
                <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-surface-bright">
                  <img src={it.thumbnail} alt={it.title} className="h-full w-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold">{it.title}</p>
                  <p className="text-xs text-muted-foreground">Qty {it.qty} × {fmtPrice(it.price)}</p>
                </div>
                <p className="font-bold">{fmtPrice(it.price * it.qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt><dd className="text-foreground">{fmtPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Shipping</dt>
              <dd className="text-foreground">{order.shippingFee === 0 ? "Free" : fmtPrice(order.shippingFee)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <dt>Points discount ({order.pointsRedeemed} pts)</dt>
                <dd className="text-primary font-semibold">-{fmtPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <dt>Total</dt><dd>{fmtPrice(order.total)}</dd>
            </div>
          </dl>

          {order.pointsEarned > 0 && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-primary/10 p-4 text-primary">
              <span className="material-icon">stars</span>
              <p className="text-sm font-semibold">
                You earned <span className="font-extrabold">{order.pointsEarned} loyalty points</span> with this order!
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface-container-low p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Shipping to</h3>
            <p className="mt-3 font-semibold">{order.shipping.fullName}</p>
            <p className="text-sm text-muted-foreground">{order.shipping.address}</p>
            <p className="text-sm text-muted-foreground">
              {order.shipping.city}, {order.shipping.country} {order.shipping.zip}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{order.shipping.phone}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Payment</h3>
            <p className="mt-3 font-semibold capitalize">
              {order.paymentMethod === "card" ? "Credit / Debit Card" : "Cash on Delivery"}
            </p>
            <p className="text-sm text-muted-foreground">Status: {order.status}</p>
            <p className="text-sm text-muted-foreground">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-container">
            Continue Shopping
          </Link>
          <Link to="/account" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary">
            View My Orders
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
