import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchCategories, fetchProducts, fmtPrice, discountedPrice } from "@/lib/api";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  // Sync local search input when URL changes
  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", { category, q: searchParams.get("q") ?? "" }],
    queryFn: () =>
      fetchProducts({
        limit: 30,
        category: category || undefined,
        q: searchParams.get("q") || undefined,
      }),
  });

  const rawProducts = data?.products ?? [];
  const products = (() => {
    if (!sort) return rawProducts;
    const sorted = [...rawProducts];
    sorted.sort((a, b) => {
      const pa = discountedPrice(a);
      const pb = discountedPrice(b);
      return sort === "price-asc" ? pa - pb : pb - pa;
    });
    return sorted;
  })();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (q) next.set("q", q);
    else next.delete("q");
    setSearchParams(next);
  };

  const setCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set("category", cat);
    else next.delete("category");
    next.delete("q");
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 md:py-16">
        {/* Heading */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Browse</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {category ? category.replace(/-/g, " ") : "All Products"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {data?.total ? `${data.total} products available` : "Discover our full collection"}
          </p>
        </div>

        {/* Search + Category filter */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={onSearch} className="flex w-full max-w-md gap-2">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="flex-1 rounded-full border border-border bg-background px-5 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-container transition-colors">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2 overflow-x-auto">
            <button
              onClick={() => setCategory("")}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                !category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              All
            </button>
            {categories?.slice(0, 10).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                {c.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Sort by price */}
        <div className="mb-6 flex items-center justify-end gap-3">
          <label htmlFor="sort" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set("sort", e.target.value);
              else next.delete("sort");
              setSearchParams(next);
            }}
            className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Products grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-surface-container-low" />
            ))}

          {!isLoading && products.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-16 text-center">
              <span className="material-icon text-5xl text-muted-foreground">search_off</span>
              <p className="mt-4 text-muted-foreground">No products found.</p>
            </div>
          )}

          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group block overflow-hidden rounded-2xl bg-surface-container-low transition-all hover:shadow-elegant"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-bright">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {p.discountPercentage > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    -{Math.round(p.discountPercentage)}%
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                <h3 className="mt-1.5 font-bold text-foreground line-clamp-1">{p.title}</h3>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-base font-bold text-foreground">{fmtPrice(discountedPrice(p))}</p>
                    {p.discountPercentage > 0 && (
                      <p className="text-xs text-muted-foreground line-through">{fmtPrice(p.price)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="material-icon text-[14px] text-primary">star</span>
                    {p.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
