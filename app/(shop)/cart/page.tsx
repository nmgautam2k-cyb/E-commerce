"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const handleProceedToPayment = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("Please login or register to proceed to payment");
      router.push("/login?redirect=/payment");
      return;
    }
    router.push("/payment");
  };

  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  return (
    <div className="page cart-container">
      <h2 className="title">My Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-card">
                <div className="cart-card-content">
                  <div className="cart-image-wrapper">
                    <img src={item.image || item.img || '/placeholder.png'} alt={item.title || item.name} className="cart-card-image" />
                  </div>
                  <div className="cart-card-details">
                    <h4>{item.title || item.name}</h4>
                    <p className="cart-card-price">Qty: {item.qty} &times; ₹{item.price}</p>
                  </div>
                </div>
                <div className="cart-card-actions">
                  <p className="cart-card-total">₹{item.price * item.qty}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="cart-summary-title">Total: ₹{total}</h3>
            <button onClick={handleProceedToPayment} className="proceed-to-payment-button">
              PROCEED TO PAYMENT
            </button>
          </div>
        </>
      )}
    </div>
  );
}