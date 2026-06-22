// DummyJSON Products API wrapper
// Docs: https://dummyjson.com/docs/products

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  weight?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  thumbnail: string;
  images: string[];
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  tags?: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const BASE = "https://dummyjson.com";

export const fmtPrice = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const discountedPrice = (p: Product) =>
  +(p.price * (1 - p.discountPercentage / 100)).toFixed(2);

export async function fetchProducts(params?: {
  limit?: number;
  skip?: number;
  category?: string;
  q?: string;
}): Promise<ProductsResponse> {
  const limit = params?.limit ?? 30;
  const skip = params?.skip ?? 0;

  let url: string;
  if (params?.q) {
    url = `${BASE}/products/search?q=${encodeURIComponent(params.q)}&limit=${limit}&skip=${skip}`;
  } else if (params?.category) {
    url = `${BASE}/products/category/${encodeURIComponent(params.category)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE}/products?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
  return res.json();
}

export async function fetchProduct(id: number | string): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE}/products/category-list`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
