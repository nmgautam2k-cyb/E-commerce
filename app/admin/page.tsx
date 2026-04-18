"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
}

interface Order {
  id: string;
  userId: number;
  items: any[];
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetch("http://localhost:5000/products"),
          fetch("http://localhost:5000/orders"),
          fetch("http://localhost:5000/users")
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();

        setProducts(productsData);
        setOrders(ordersData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = () => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === "admin").length;
    const customerUsers = users.filter(u => u.role === "customer").length;

    const productsByCategory = {
      tshirts: products.filter(p => p.category === "tshirts").length,
      shirts: products.filter(p => p.category === "shirts").length,
      pants: products.filter(p => p.category === "pants").length
    };

    const ordersByStatus = {
      pending: orders.filter(o => o.status === "pending").length,
      processing: orders.filter(o => o.status === "processing").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length
    };

    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.productId);
        return itemSum + (product ? product.price * item.quantity : 0);
      }, 0);
      return sum + orderTotal;
    }, 0);

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      adminUsers,
      customerUsers,
      productsByCategory,
      ordersByStatus,
      totalRevenue
    };
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading dashboard...</div>;
  }

  const stats = calculateStats();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome Admin &#x1f;44b;</p>

  
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px", 
        marginBottom: "30px" 
      }}>
        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          backgroundColor: "#e3f2fd",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>Total Products</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "0" }}>{stats.totalProducts}</p>
        </div>

        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          backgroundColor: "#e8f5e8",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#388e3c" }}>Total Orders</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "0" }}>{stats.totalOrders}</p>
        </div>

        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          backgroundColor: "#fff3e0",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#f57c00" }}>Total Users</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "0" }}>{stats.totalUsers}</p>
        </div>

        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          backgroundColor: "#fce4ec",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#c2185b" }}>Total Revenue</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "0" }}>Rs. {stats.totalRevenue}</p>
        </div>
      </div>

  
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          backgroundColor: "#f9f9f9" 
        }}>
          <h3>Products by Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>T-Shirts</span>
              <strong>{stats.productsByCategory.tshirts}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Shirts</span>
              <strong>{stats.productsByCategory.shirts}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Pants</span>
              <strong>{stats.productsByCategory.pants}</strong>
            </div>
          </div>
        </div>

    
        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          backgroundColor: "#f9f9f9" 
        }}>
          <h3>Orders by Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Pending</span>
              <strong style={{ color: "#ffc107" }}>{stats.ordersByStatus.pending}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Processing</span>
              <strong style={{ color: "#17a2b8" }}>{stats.ordersByStatus.processing}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Shipped</span>
              <strong style={{ color: "#007bff" }}>{stats.ordersByStatus.shipped}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Delivered</span>
              <strong style={{ color: "#28a745" }}>{stats.ordersByStatus.delivered}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Cancelled</span>
              <strong style={{ color: "#dc3545" }}>{stats.ordersByStatus.cancelled}</strong>
            </div>
          </div>
        </div>


        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          backgroundColor: "#f9f9f9" 
        }}>
          <h3>Users by Role</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Admin Users</span>
              <strong style={{ color: "#856404" }}>{stats.adminUsers}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>Customer Users</span>
              <strong style={{ color: "#007bff" }}>{stats.customerUsers}</strong>
            </div>
          </div>
        </div>

      
        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          backgroundColor: "#f9f9f9" 
        }}>
          <h3>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a 
              href="/admin/products" 
              style={{ 
                display: "block", 
                padding: "10px", 
                backgroundColor: "#007bff", 
                color: "white", 
                textAlign: "center", 
                borderRadius: "4px", 
                textDecoration: "none" 
              }}
            >
              Manage Products
            </a>
            <a 
              href="/admin/orders" 
              style={{ 
                display: "block", 
                padding: "10px", 
                backgroundColor: "#28a745", 
                color: "white", 
                textAlign: "center", 
                borderRadius: "4px", 
                textDecoration: "none" 
              }}
            >
              Manage Orders
            </a>
            <a 
              href="/admin/users" 
              style={{ 
                display: "block", 
                padding: "10px", 
                backgroundColor: "#ffc107", 
                color: "black", 
                textAlign: "center", 
                borderRadius: "4px", 
                textDecoration: "none" 
              }}
            >
              Manage Users
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}