"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
}

export default function TshirtPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/products");
        const allProducts = await res.json();
        // Filter only t-shirts added by admin
        const tshirts = allProducts.filter((p: Product) => p.category === "tshirts");
        setProducts(tshirts);
      } catch (error) {
        console.error("Failed to fetch t-shirts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("Please login or register to add items to cart");
      router.push("/login?redirect=/tshirts");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  const addToWishlist = (product: any) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const existing = wishlist.find((item: any) => item.id === product.id);
    if (!existing) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("Added to wishlist!");
    } else {
      alert("Already in wishlist!");
    }
  };

  return (
    <div className="page">
      <h2 className="title">T-Shirts</h2>

      <div style={{ maxWidth: "600px", margin: "0 auto 30px" }}>
        <input
          type="text"
          placeholder="Search t-shirts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "15px", border: "1px solid #ccc", outline: "none", fontSize: "16px" }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No t-shirts available. Admin will add products soon.</p>
      ) : (
        <div className="product-grid">
          {products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
            <div key={p.id} className="card">
              <span className="heart" onClick={() => addToWishlist(p)}>♥</span>
              <img src={p.image} alt={p.title} />
              <h4 style={{ marginTop: "10px" }}>{p.title}</h4>
              <p>₹{p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}