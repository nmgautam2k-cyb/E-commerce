import Link from "next/link";
import HeroSlideshow from "../components/HeroSlideshow";

export default function Home() {
  return (
    <div className="home-container">
  
      <HeroSlideshow />

      <section className="section">
        <h2 className="section-title">CATEGORIES</h2>
        <div className="grid-3">
          <Link href="/shirts" className="card">
            <img src="/shirt.avif" alt="Shirts" />
            <h4 style={{marginTop: "15px"}}>SHIRTS</h4>
          </Link>

          <Link href="/pants" className="card">
            <img src="/pant.avif" alt="Pants" />
            <h4 style={{marginTop: "15px"}}>PANTS</h4>
          </Link>

          <Link href="/tshirts" className="card">
            <img src="/Tshirt.avif" alt="T-Shirts" />
            <h4 style={{marginTop: "15px"}}>T-SHIRTS</h4>
          </Link>
        </div>
      </section>

      <section className="section bg-light">
        <h2 className="section-title">NEW ARRIVALS</h2>
        <div className="product-grid">
          <Link href="/shirts" className="card">
            <img src="/newarrival1.webp" alt="New Arrival 1" />
            <h4 style={{marginTop: "10px"}}>Top 1</h4>
          </Link>
          <Link href="/pants" className="card">
            <img src="/newarrival2.webp" alt="New Arrival 2" />
            <h4 style={{marginTop: "10px"}}>Top 2</h4>
          </Link>
          <Link href="/tshirts" className="card">
            <img src="/newarrival3.webp" alt="New Arrival 3" />
            <h4 style={{marginTop: "10px"}}>Top 3</h4>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">DISCOUNTS</h2>
        <div className="grid-3">
          <div className="card-box">
            <h3>FLAT 30% OFF</h3>
            <p>On all Shirts</p>
            <Link href="/shirts" className="shop-btn-small">Shop Shirts</Link>
          </div>
          <div className="card-box bg-black text-white">
            <h3>BUY 1 GET 1</h3>
            <p>On T-Shirts</p>
            <Link href="/tshirts" className="shop-btn-small white-btn">Shop T-Shirts</Link>
          </div>
          <div className="card-box">
            <h3>SPECIAL OFFER</h3>
            <p>Up to 50% Off Pants</p>
            <Link href="/pants" className="shop-btn-small">Shop Pants</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <h2>VELURE</h2>
          <p>Email: support@velure.com | Phone: +1 234 567 890</p>
        </div>
      </footer>
    </div>
  );
}