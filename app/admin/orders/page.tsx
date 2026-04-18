"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount?: number;
  createdAt?: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch("http://localhost:5000/orders"),
          fetch("http://localhost:5000/products"),
          fetch("http://localhost:5000/users")
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        const usersData = await usersRes.json();

        setOrders(ordersData);
        setProducts(productsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await fetch(`http://localhost:5000/orders/${orderId}`, {
          method: "DELETE",
        });
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getUserById = (userId: number) => {
    return users.find(u => parseInt(u.id) === userId);
  };

  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
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
    return <div style={{ padding: "20px" }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders Management</h2>
      
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => {
            const user = getUserById(order.userId);
            const orderTotal = calculateOrderTotal(order.items);

            return (
              <div key={order.id} style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "20px",
                backgroundColor: "#f9f9f9"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p><strong>Customer:</strong> {user ? user.name : `User ID: ${order.userId}`}</p>
                    {user && <p style={{ fontSize: "14px", color: "#666" }}>{user.email}</p>}
                    <p><strong>Total Amount:</strong> Rs. {orderTotal}</p>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
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
                    
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "12px"
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <button
                      onClick={() => deleteOrder(order.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Delete Order
                    </button>
                  </div>
                </div>

                <div>
                  <h4>Order Items:</h4>
                  {order.items.length === 0 ? (
                    <p>No items in this order.</p>
                  ) : (
                    <div style={{ display: "grid", gap: "10px" }}>
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
                                Rs. {product ? product.price * item.quantity : 0}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}