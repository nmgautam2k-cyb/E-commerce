"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/user");
      const users = await res.json();

      const exists = users.find((u: any) => u.email === email);
      if (exists) {
        alert("User already exists");
        return;
      }

      const save = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Date.now(), // ✅ important
          name,
          email,
          password,
          role,
        }),
      });

      if (!save.ok) throw new Error("Failed");

      alert("Registered Successfully");
      router.push("/login");

    } catch (error) {
      console.error(error);
      alert("Something went wrong (Check JSON server)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="logo">VELURE</h1>
      <p className="sub-logo">APPAREL</p>

      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="input-group">
            <input
              type="text"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Full Name</label>
          </div>

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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-text">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}