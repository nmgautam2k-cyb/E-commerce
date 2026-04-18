"use client";

import { useEffect, useState, useRef } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: "tshirts" | "shirts" | "pants";
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "tshirts" as "tshirts" | "shirts" | "pants",
    image: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      setProducts(await res.json());
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      category: "tshirts",
      image: ""
    });
    setEditingId(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({...formData, image: base64String});
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || "/placeholder.png"
      };

      if (editingId) {
        await fetch(`http://localhost:5000/products/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
      } else {
        await fetch("http://localhost:5000/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      image: product.image
    });
    setEditingId(product.id);
    setImagePreview(product.image);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`http://localhost:5000/products/${id}`, {
          method: "DELETE",
        });
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const filteredProducts = (category: string) => 
    products.filter(p => p.category === category);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products Management</h2>

      {/* Add/Edit Product Form */}
      <div style={{ 
        marginBottom: "30px", 
        padding: "20px", 
        border: "1px solid #ddd", 
        borderRadius: "8px" 
      }}>
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label>Product Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                style={{ 
                  width: "100%", 
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }}
              />
            </div>

            <div>
              <label>Price (Rs):</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                min="0"
                step="0.01"
                style={{ 
                  width: "100%", 
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }}
              />
            </div>

            <div>
              <label>Category:</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                style={{ 
                  width: "100%", 
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }}
              >
                <option value="tshirts">T-Shirts</option>
                <option value="shirts">Shirts</option>
                <option value="pants">Pants</option>
              </select>
            </div>

            <div>
              <label>Product Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ 
                  width: "100%", 
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }}
              />
              {imagePreview && (
                <div style={{ marginTop: "10px" }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      width: "100px", 
                      height: "100px", 
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: loading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Saving..." : (editingId ? "Update Product" : "Add Product")}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List by Category */}
      {["tshirts", "shirts", "pants"].map(category => (
        <div key={category} style={{ marginBottom: "30px" }}>
          <h3 style={{ textTransform: "capitalize" }}>{category}</h3>
          
          {filteredProducts(category).length === 0 ? (
            <p>No {category} found.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {filteredProducts(category).map((product) => (
                <div key={product.id} style={{ 
                  border: "1px solid #ddd", 
                  borderRadius: "8px", 
                  padding: "15px",
                  backgroundColor: "#f9f9f9"
                }}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    style={{ 
                      width: "100%", 
                      height: "150px", 
                      objectFit: "cover",
                      borderRadius: "4px",
                      marginBottom: "10px"
                    }}
                  />
                  
                  <h4>{product.title}</h4>
                  <p style={{ color: "#007bff", fontWeight: "bold" }}>Rs. {product.price}</p>
                  <p style={{ fontSize: "12px", color: "#666" }}>Category: {product.category}</p>
                  
                  <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#ffc107",
                        color: "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}