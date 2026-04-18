"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="logo"><Link href="/">VELURE</Link></div>

      <div className="nav-right">
        <Link href="/">Home</Link>
        <Link href="/shirts">Shirt</Link>
        <Link href="/pants">Pant</Link>
        <Link href="/tshirts">Tshirt</Link>
        <Link href="/cart">MyCart</Link>
        <Link href="/wishlist">Wishlist</Link>
        <Link href="/orders">Orders</Link>
        
        {user ? (
          <button onClick={handleLogout} style={{ background:"transparent", border:"none", color:"white", marginLeft:"15px", cursor:"pointer", fontSize:"14px", width:"auto", padding:0, display:"inline" }}>
            Logout ({user.name})
          </button>
        ) : (
          <>
            <Link href="/login">Sign In</Link>
            <Link href="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}