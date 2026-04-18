"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/user");
      const users = await res.json();

      const user = users.find(
        (u: any) =>
          u.email === email &&
          u.password === password &&
          u.role === role
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));

        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");

        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push(redirect || "/");
        }
      } else {
        alert("Invalid credentials or role mismatch");
      }

    } catch (error) {
      console.error(error);
      alert("Server error (Check JSON server)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="logo">VELURE</h1>
      <p className="sub-logo">APPAREL</p>

      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleSubmit} className="auth-form">

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

          <div className="input-group">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="auth-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-text">
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}