"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get("q")?.toLowerCase() || "";

  const allProducts = JSON.parse(localStorage.getItem("allProducts") || "[]");

  const filtered = allProducts.filter((p: any) =>
    p.name.toLowerCase().includes(q)
  );

  return (
    <div className="page">
      <h2 className="title">Search Results 🔍</h2>

      <div className="product-grid">
        {filtered.map((p: any) => (
          <div key={p.id} className="card">
            <img src={p.img} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}