"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("Please login or register to add items to cart");
      router.push("/login?redirect=/wishlist");
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

  return (
    <div className="page">
      <h2 className="title">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p style={{textAlign:"center"}}>Your wishlist is empty.</p>
      ) : (
        <div className="product-grid">
          {wishlist.map(p => (
            <div key={p.id} className="card">
              <span className="heart active" onClick={() => removeFromWishlist(p.id)}>♥</span>
              <div className="wishlist-image-wrapper">
                <img src={p.image || p.img || '/placeholder.png'} alt={p.title || p.name} />
              </div>
              <h4 style={{marginTop: "10px"}}>{p.title || p.name}</h4>
              <p>₹{p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}