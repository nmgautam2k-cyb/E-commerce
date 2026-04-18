"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" as "admin" | "customer"
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users");
      setUsers(await res.json());
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer"
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (editingId) {
        await fetch(`http://localhost:5000/users/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else {
        await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    });
    setEditingId(user.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`http://localhost:5000/users/${id}`, {
          method: "DELETE",
        });
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const adminUsers = users.filter(u => u.role === "admin");
  const customerUsers = users.filter(u => u.role === "customer");

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users Management</h2>

      {/* Add/Edit User Form */}
      {showAddForm && (
        <div style={{ 
          marginBottom: "30px", 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "8px",
          backgroundColor: "#f9f9f9"
        }}>
          <h3>{editingId ? "Edit User" : "Add New User"}</h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                <label>Password:</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                <label>Role:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  style={{ 
                    width: "100%", 
                    padding: "8px",
                    marginTop: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                  }}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
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
                {loading ? "Saving..." : (editingId ? "Update User" : "Add User")}
              </button>
              
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
            </div>
          </form>
        </div>
      )}

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Add New User
        </button>
      )}

      {/* Admin Users */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Admin Users ({adminUsers.length})</h3>
        
        {adminUsers.length === 0 ? (
          <p>No admin users found.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
            {adminUsers.map((user) => (
              <div key={user.id} style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "15px",
                backgroundColor: "#fff3cd"
              }}>
                <h4>{user.name}</h4>
                <p style={{ margin: "5px 0", color: "#666" }}>{user.email}</p>
                <div style={{ 
                  display: "inline-block", 
                  padding: "3px 8px", 
                  backgroundColor: "#856404", 
                  color: "white", 
                  borderRadius: "4px", 
                  fontSize: "12px",
                  marginBottom: "10px"
                }}>
                  ADMIN
                </div>
                
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => handleEdit(user)}
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
                    onClick={() => handleDelete(user.id)}
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

      {/* Customer Users */}
      <div>
        <h3>Customer Users ({customerUsers.length})</h3>
        
        {customerUsers.length === 0 ? (
          <p>No customer users found.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
            {customerUsers.map((user) => (
              <div key={user.id} style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "15px",
                backgroundColor: "#f9f9f9"
              }}>
                <h4>{user.name}</h4>
                <p style={{ margin: "5px 0", color: "#666" }}>{user.email}</p>
                <div style={{ 
                  display: "inline-block", 
                  padding: "3px 8px", 
                  backgroundColor: "#007bff", 
                  color: "white", 
                  borderRadius: "4px", 
                  fontSize: "12px",
                  marginBottom: "10px"
                }}>
                  CUSTOMER
                </div>
                
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => handleEdit(user)}
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
                    onClick={() => handleDelete(user.id)}
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
    </div>
  );
}