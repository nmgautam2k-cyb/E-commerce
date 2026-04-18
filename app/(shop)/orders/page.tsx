"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../../lib/auth";

interface Order {
  id: string;
  userId: string | null;
  items: { productId: string; quantity: number }[];
  status: string;
  totalAmount: number;
  createdAt: string;
  paymentMethod: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();

    // ❌ BLOCK ADMIN
    if (user?.role === "admin") {
      alert("Admin cannot view this page");
      router.push("/admin");
      return;
    }

    // Fetch orders and products from database
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("http://localhost:3001/orders"),
          fetch("http://localhost:3001/products")
        ]);

        const allOrders = await ordersRes.json();
        const productsData = await productsRes.json();

        // Filter orders for current user
        const userOrders = allOrders.filter(
          (order: Order) => order.userId === user?.id
        );

        setOrders(userOrders);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#ffc107";
      case "processing": return "#17a2b8";
      case "shipped": return "#007bff";
      case "delivered": return "#28a745";
      case "cancelled": return "#dc3545";
      default: return "#6c757d";
    }
  };

  if (loading) {
    return <div className="page"><h2>Orders</h2><p>Loading orders...</p></div>;
  }

  return (
    <div className="page">
      <h2 className="title">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found. Start shopping to place your first order!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div key={order.id} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#f9f9f9"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                <div>
                  <h3>Order #{order.id}</h3>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Payment: {order.paymentMethod || "Online"}
                  </p>
                  <p><strong>Total: ₹{order.totalAmount || 0}</strong></p>
                </div>
                
                <div style={{
                  padding: "5px 10px",
                  backgroundColor: getStatusColor(order.status),
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  fontWeight: "bold"
                }}>
                  {order.status}
                </div>
              </div>

              <div>
                <h4>Order Items:</h4>
                {order.items.length === 0 ? (
                  <p>No items in this order.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {order.items.map((item, index) => {
                      const product = getProductById(item.productId);
                      return (
                        <div key={index} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          padding: "10px",
                          backgroundColor: "white",
                          borderRadius: "4px",
                          border: "1px solid #eee"
                        }}>
                          {product && (
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "4px"
                              }}
                            />
                          )}
                          
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: "bold", margin: "0" }}>
                              {product ? product.title : `Product ID: ${item.productId}`}
                            </p>
                            <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                              Quantity: {item.quantity}
                            </p>
                            <p style={{ margin: "5px 0", color: "#007bff", fontWeight: "bold" }}>
                              ₹{product ? product.price * item.quantity : 0}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}