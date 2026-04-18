"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getUser } from "../../../lib/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const user = getUser();
    if (user?.role === "admin") {
      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
    }
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/users");
      const users = await res.json();
      
      const user = users.find(
        (u: any) => u.email === email && u.password === password && u.role === "admin"
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        const redirect = searchParams.get("redirect") || "/admin";
        router.push(redirect);
      } else {
        setError("Invalid admin credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="logo">VELURE</h1>
      <p className="sub-logo">ADMIN PORTAL</p>

      <div className="auth-card">
        <h2 className="auth-title">Admin Login</h2>

        <form onSubmit={handleLogin} className="auth-form">

          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          {error && (
            <div style={{ 
              color: "red", 
              marginBottom: "15px",
              fontSize: "14px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-text">
          <Link href="/login">Customer Login</Link>
        </p>
      </div>
    </div>
  );
}