"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdmin, logout } from "../../lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // 🔐 PROTECT ADMIN ROUTES
  useEffect(() => {
    const checkAdmin = () => {
      if (!isAdmin()) {
        router.push("/login?redirect=/admin");
      }
    };

    checkAdmin();
  }, [router]);

  return (
    <div className="admin-container">
      {/* 🔥 ADMIN NAVBAR */}
      <div className="navbar">
        <h2 className="logo">Admin Panel</h2>

        <div className="nav-right">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* 📦 PAGE CONTENT */}
      <div style={{ marginTop: "20px" }}>
        {children}
      </div>
    </div>
  );
}