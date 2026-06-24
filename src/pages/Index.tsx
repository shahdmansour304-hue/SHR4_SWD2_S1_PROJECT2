import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashDeals from "@/components/FlashDeals";
import heroShopping from "@/assets/hero-shopping.jpg";
import { fetchProducts, fmtPrice, discountedPrice } from "@/lib/api";

const Index = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({ limit: 6 }),
  });

  const featured = data?.products?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container grid gap-12 py-20 md:grid-cols-2 md:py-28 items-center">
          <div className="animate-fade-in-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-glow">New Arrival</p>
            <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
              The Future,<br/>Crafted Quietly.
            </h1>
            <p className="mt-6 max-w-md text-base text-primary-foreground/70 leading-relaxed">
              Discover a curated collection of premium products. Authentic, beautifully crafted, and ready to elevate your everyday.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-7 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary-glow hover:text-primary"
              >
                Shop Now
                <span className="material-icon text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
              >
                View Cart
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute -inset-10 rounded-full bg-primary-glow/20 blur-3xl" />
            <img
              src={heroShopping}
              alt="Happy shopper holding colorful shopping bags"
              width={1600}
              height={1280}
              className="relative w-full rounded-2xl shadow-elegant object-cover aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="border-y border-border bg-surface-container-low">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {[
            { icon: "laptop_mac", label: "Laptops", cat: "laptops" },
            { icon: "smartphone", label: "Smartphones", cat: "smartphones" },
            { icon: "watch", label: "Fragrances", cat: "fragrances" },
            { icon: "diamond", label: "Beauty", cat: "beauty" },
          ].map((c) => (
            <Link
              key={c.label}
              to={`/shop?category=${c.cat}`}
              className="group flex flex-col items-center gap-3 bg-background py-10 transition-colors hover:bg-surface-container"
            >
              <span className="material-icon text-4xl text-primary transition-transform group-hover:scale-110">{c.icon}</span>
              <span className="text-sm font-semibold text-foreground">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Deals */}
      <FlashDeals />

      {/* Featured Products */}
      <section className="container py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Curated</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Featured Selection</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
            View All <span className="material-icon text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-surface-container-low" />
            ))}

          {featured.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group block overflow-hidden rounded-2xl bg-surface-container-low transition-all hover:shadow-elegant"
            >
              <div className="aspect-square overflow-hidden bg-surface-bright">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                <h3 className="mt-2 text-xl font-bold text-foreground line-clamp-1">{p.title}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">{fmtPrice(discountedPrice(p))}</span>
                  <span className="material-icon text-primary">arrow_outward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust badges — why shop with us */}
      <section className="border-y border-border bg-surface-container-low">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
          {[
            { icon: "local_shipping", title: "Free Shipping", desc: "On orders over $50" },
            { icon: "lock", title: "Secure Payment", desc: "100% protected checkout" },
            { icon: "autorenew", title: "Easy Returns", desc: "30-day money back" },
            { icon: "support_agent", title: "24/7 Support", desc: "We're here to help" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <span className="material-icon text-3xl text-primary">{b.icon}</span>
              <div>
                <p className="text-sm font-bold text-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials — social proof */}
      <section className="container py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Loved by thousands</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">What Our Customers Say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Sarah M.", text: "Fast delivery and the quality is just incredible. LuxeCart is my go-to store now!", rating: 5 },
            { name: "Ahmed K.", text: "Customer support helped me pick the perfect product. Loyalty points are a huge bonus.", rating: 5 },
            { name: "Jessica R.", text: "I love the flash deals! Got 30% off my favorite item. Highly recommend.", rating: 5 },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl bg-surface-container-low p-8 shadow-card">
              <div className="flex gap-1 text-primary mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="material-icon text-[18px]">star</span>
                ))}
              </div>
              <p className="text-foreground leading-relaxed">"{t.text}"</p>
              <p className="mt-6 text-sm font-bold text-muted-foreground">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container pb-24">
        <div className="rounded-3xl bg-gradient-hero px-8 py-16 md:px-16 md:py-20 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Join the Elite</h2>
          <p className="mt-4 mx-auto max-w-xl text-primary-foreground/70">
            Be the first to experience new arrivals, exclusive previews, and member-only pricing.
          </p>
          <form className="mt-8 mx-auto flex max-w-md gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-5 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-glow"
            />
            <button className="rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary-glow">
              Join
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
