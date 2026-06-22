import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchProduct, fmtPrice, discountedPrice } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "@/hooks/use-toast";

const Product = () => {
  const { id } = useParams();
  const productId = id ?? "1";
  const navigate = useNavigate();
  const { add } = useCart();
  const { isFavorite, toggle: toggleFav } = useFavorites();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-surface-container-low" />
            <div className="space-y-4">
              <div className="h-8 w-1/3 animate-pulse rounded bg-surface-container-low" />
              <div className="h-12 w-2/3 animate-pulse rounded bg-surface-container-low" />
              <div className="h-24 animate-pulse rounded bg-surface-container-low" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const finalPrice = discountedPrice(product);
  const images = product.images?.length ? product.images : [product.thumbnail];

  const handleAdd = (buyNow = false) => {
    add(
      {
        id: product.id,
        title: product.title,
        category: product.category,
        price: finalPrice,
        thumbnail: product.thumbnail,
      },
      qty
    );
    toast({ title: "Added to cart", description: `${product.title} × ${qty}` });
    if (buyNow) navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-primary capitalize">
            {product.category.replace(/-/g, " ")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{product.title}</span>
        </nav>

        {/* Product hero */}
        <section className="mt-8 grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-surface-container-low">
              <img
                src={images[activeImage]}
                alt={product.title}
                className="h-full w-full object-contain p-8"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 bg-surface-container-low transition-all ${
                      activeImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary capitalize">
              {product.category.replace(/-/g, " ")}
            </span>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`material-icon text-[18px] ${i < Math.round(product.rating) ? "" : "opacity-30"}`}>
                    star
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviews?.length ?? 0} reviews)
              </span>
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{product.title}</h1>
            {product.brand && <p className="mt-2 text-sm text-muted-foreground">by {product.brand}</p>}
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-foreground">{fmtPrice(finalPrice)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-lg text-muted-foreground line-through">{fmtPrice(product.price)}</span>
              )}
            </div>

            <p className={`mt-2 text-sm font-semibold ${product.stock > 0 ? "text-primary" : "text-destructive"}`}>
              {product.availabilityStatus ?? (product.stock > 0 ? `In Stock (${product.stock})` : "Out of stock")}
            </p>

            {/* Quantity */}
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-border bg-background">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary"
                    aria-label="Decrease"
                  >
                    <span className="material-icon text-[18px]">remove</span>
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary"
                    aria-label="Increase"
                  >
                    <span className="material-icon text-[18px]">add</span>
                  </button>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</span>
                  <span className="text-2xl font-extrabold text-primary">{fmtPrice(finalPrice * qty)}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAdd(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-container"
              >
                <span className="material-icon text-[18px]">shopping_bag</span>
                Add to Cart
              </button>
              <button
                onClick={() => handleAdd(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-background px-6 py-4 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  const fav = isFavorite(product.id);
                  toggleFav({
                    id: product.id,
                    title: product.title,
                    category: product.category,
                    price: finalPrice,
                    thumbnail: product.thumbnail,
                  });
                  toast({
                    title: fav ? "Removed from favorites" : "Added to favorites",
                    description: product.title,
                  });
                }}
                aria-label="Toggle favorite"
                className={`grid h-14 w-14 place-items-center rounded-full border transition-all ${
                  isFavorite(product.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <span className="material-icon text-[22px]">favorite</span>
              </button>
            </div>

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              {product.shippingInformation && (
                <div className="flex items-center gap-2">
                  <span className="material-icon text-[18px] text-primary">local_shipping</span>
                  {product.shippingInformation}
                </div>
              )}
              {product.warrantyInformation && (
                <div className="flex items-center gap-2">
                  <span className="material-icon text-[18px] text-primary">verified_user</span>
                  {product.warrantyInformation}
                </div>
              )}
              {product.returnPolicy && (
                <div className="flex items-center gap-2">
                  <span className="material-icon text-[18px] text-primary">undo</span>
                  {product.returnPolicy}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Specs / details */}
        <section className="mt-32">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Details</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Product Information</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {product.brand && (
              <article className="rounded-2xl bg-surface-container-low p-8">
                <span className="material-icon text-3xl text-primary">verified</span>
                <h3 className="mt-4 text-2xl font-bold text-foreground">Brand</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{product.brand}</p>
              </article>
            )}
            {product.sku && (
              <article className="rounded-2xl bg-surface-container-low p-8">
                <span className="material-icon text-3xl text-primary">qr_code</span>
                <h3 className="mt-4 text-2xl font-bold text-foreground">SKU</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{product.sku}</p>
              </article>
            )}
            {product.weight && (
              <article className="rounded-2xl bg-surface-container-low p-8">
                <span className="material-icon text-3xl text-primary">scale</span>
                <h3 className="mt-4 text-2xl font-bold text-foreground">Weight</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{product.weight} kg</p>
              </article>
            )}
            <article className="rounded-2xl bg-surface-container-low p-8">
              <span className="material-icon text-3xl text-primary">inventory_2</span>
              <h3 className="mt-4 text-2xl font-bold text-foreground">Stock</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{product.stock} units available</p>
            </article>
          </div>
        </section>

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-32">
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Voices</p>
              <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Reviews</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {product.reviews.map((r, i) => (
                <blockquote key={i} className="rounded-2xl bg-surface-container-low p-8">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className={`material-icon text-[18px] ${j < r.rating ? "" : "opacity-30"}`}>
                        star
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-lg text-foreground leading-relaxed">"{r.comment}"</p>
                  <footer className="mt-6">
                    <p className="font-bold text-foreground">{r.reviewerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(r.date).toLocaleDateString()}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Product;
