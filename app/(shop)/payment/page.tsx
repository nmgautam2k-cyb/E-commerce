"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("Please login or register to complete your order");
      router.push("/login?redirect=/payment");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalAmount = cart.reduce((a: any, b: any) => a + b.price * b.qty, 0);
    setTotal(totalAmount);
  }, []);

  const handlePayment = async (method: string) => {
    // Simulate payment logic
    alert(`Processing ${method} payment of ₹${total}...`);
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      alert("Please login to place order");
      router.push("/login?redirect=/payment");
      return;
    }

    // Format order items for database
    const orderItems = cart.map((item: any) => ({
      productId: item.id,
      quantity: item.qty || 1
    }));

    // Calculate total
    const orderTotal = cart.reduce((sum: number, item: any) => sum + (item.price * (item.qty || 1)), 0);

    const newOrder = {
      id: Date.now().toString(),
      userId: user.id || null,
      items: orderItems,
      status: "pending",
      totalAmount: orderTotal,
      createdAt: new Date().toISOString(),
      paymentMethod: method
    };
    
    try {
      // Save order to database (db.json)
      await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
      
      alert("Payment Successful! Order placed.");
      localStorage.removeItem("cart"); // clear cart
      router.push("/payment-success"); // navigate to success page
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("Payment processed but order saving failed. Please contact support.");
    }
  };

  return (
    <div className="page" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h2 className="title">CHECKOUT</h2>
      
      <div style={{ background: "#f9f9f9", padding: "40px", border: "1px solid #ddd", marginBottom: "30px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Order Total</h3>
        <p style={{ fontSize: "36px", fontWeight: "bold" }}>₹{total}</p>
      </div>

      <h3 style={{ marginBottom: "20px", textTransform: "uppercase", letterSpacing: "2px" }}>Select Payment Method</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <button 
          onClick={() => handlePayment("Google Pay")}
          style={{ background: "#202124", padding: "18px", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
        >
          {/* Simple GPay text representation */}
          <span style={{fontWeight: "bold", fontSize: "18px"}}>GPay</span> • Google Pay
        </button>

        <button 
          onClick={() => handlePayment("PhonePe")}
          style={{ background: "#5f259f", padding: "18px", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
        >
          <span style={{fontWeight: "bold", fontSize: "18px", color: "white"}}>पे</span> PhonePe
        </button>
        
        <button 
          onClick={() => handlePayment("Cash on Delivery")}
          style={{ background: "white", color: "black", border: "2px solid black", padding: "18px", fontSize: "16px" }}
        >
          Cash on Delivery
        </button>
      </div>
    </div>
  );
}