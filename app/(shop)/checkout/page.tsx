"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 🔥 CHECK LOGIN FIRST
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      alert("Please login or register to continue");
      router.push("/login?redirect=/checkout"); // 🔥 redirect back after login
      return;
    }

    // ✅ LOAD CART
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const placeOrder = async () => {
    // CHECK LOGIN AGAIN (extra safety)
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      alert("Please login or register first");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!address) return alert("Enter address");

    await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, total, address, user }), // 🔥 store user also
    });

    localStorage.removeItem("cart");
    router.push("/payment");
  };

  return (
    <div className="page">
      <h2 className="title">Checkout 🧾</h2>

      <div style={{ maxWidth: "500px", margin: "auto" }}>
        <textarea
          placeholder="Enter delivery address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", padding: "10px", height: "100px" }}
        />

        <h3>Total: ₹{total}</h3>

        <button onClick={placeOrder}>Place Order</button>
      </div>
    </div>
  );
}