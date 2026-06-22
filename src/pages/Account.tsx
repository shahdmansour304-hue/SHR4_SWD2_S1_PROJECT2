import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAccount } from "@/hooks/useAccount";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useOrders } from "@/hooks/useOrders";
import { useLoyalty, POINT_VALUE } from "@/hooks/useLoyalty";
import { fmtPrice } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Account = () => {
  const { account, signIn, signOut, isSignedIn } = useAccount();
  const { count: cartCount } = useCart();
  const { count: favCount } = useFavorites();
  const { orders } = useOrders();
  const { points } = useLoyalty();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signIn(name.trim(), email.trim());
    toast({ title: "Welcome", description: `Signed in as ${name}` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12 md:py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Profile</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {isSignedIn ? "Your Account" : "Sign In"}
          </h1>
        </div>

        {!isSignedIn ? (
          <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-2xl bg-surface-container-low p-8">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full rounded-full border border-border bg-background px-5 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-full border border-border bg-background px-5 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-container transition-colors"
            >
              Sign In
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Demo account — stored locally on this device.
            </p>
          </form>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 rounded-2xl bg-surface-container-low p-8">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                {account!.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">{account!.name}</h2>
              <p className="text-sm text-muted-foreground">{account!.email}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Member since {new Date(account!.signedInAt).toLocaleDateString()}
              </p>
              <button
                onClick={signOut}
                className="mt-6 w-full rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:border-destructive hover:text-destructive transition-colors"
              >
                Sign Out
              </button>
            </div>

            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 rounded-2xl bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Loyalty Points</p>
                    <p className="mt-2 text-4xl font-extrabold">{points}</p>
                    <p className="mt-1 text-sm opacity-80">
                      Worth up to {fmtPrice(points * POINT_VALUE)} off your next order
                    </p>
                  </div>
                  <span className="material-icon text-5xl opacity-80">stars</span>
                </div>
                <Link
                  to="/checkout"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2 text-xs font-bold text-primary hover:bg-primary-glow"
                >
                  Redeem at checkout <span className="material-icon text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <Link to="/cart" className="rounded-2xl bg-surface-container-low p-6 hover:shadow-elegant transition-shadow">
                <span className="material-icon text-3xl text-primary">shopping_cart</span>
                <h3 className="mt-3 text-lg font-bold text-foreground">Cart</h3>
                <p className="text-sm text-muted-foreground">{cartCount} items</p>
              </Link>
              <Link to="/favorites" className="rounded-2xl bg-surface-container-low p-6 hover:shadow-elegant transition-shadow">
                <span className="material-icon text-3xl text-primary">favorite</span>
                <h3 className="mt-3 text-lg font-bold text-foreground">Favorites</h3>
                <p className="text-sm text-muted-foreground">{favCount} saved</p>
              </Link>
              <Link to="/shop" className="rounded-2xl bg-surface-container-low p-6 hover:shadow-elegant transition-shadow">
                <span className="material-icon text-3xl text-primary">storefront</span>
                <h3 className="mt-3 text-lg font-bold text-foreground">Shop</h3>
                <p className="text-sm text-muted-foreground">Browse the catalog</p>
              </Link>
              <div className="rounded-2xl bg-surface-container-low p-6">
                <span className="material-icon text-3xl text-primary">receipt_long</span>
                <h3 className="mt-3 text-lg font-bold text-foreground">Orders</h3>
                <p className="text-sm text-muted-foreground">{orders.length} placed</p>
              </div>
            </div>

            {/* Orders history */}
            <div className="lg:col-span-3 mt-4">
              <h2 className="text-2xl font-bold text-foreground mb-4">Order History</h2>
              {orders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                  <span className="material-icon text-4xl text-muted-foreground">receipt_long</span>
                  <p className="mt-3 text-muted-foreground">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Start Shopping <span className="material-icon text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {orders.map((o) => (
                    <li key={o.id}>
                      <Link
                        to={`/order/${o.id}`}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-container-low p-5 hover:shadow-soft transition-shadow"
                      >
                        <div>
                          <p className="font-bold text-foreground">{o.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(o.createdAt).toLocaleString()} • {o.items.length} item{o.items.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                            {o.status}
                          </span>
                          <span className="text-lg font-extrabold text-foreground">{fmtPrice(o.total)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Account;
