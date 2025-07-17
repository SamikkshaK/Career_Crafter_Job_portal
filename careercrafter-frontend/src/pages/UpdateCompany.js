import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // your Axios instance with token interceptor
import NavbarEmployer from "../components/NavbarEmployer";

const UpdateCompany = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [company, setCompany] = useState({
    companyId: "",
    companyName: "",
    industry: "",
    location: "",
  });

  const [message, setMessage] = useState("");

  // 🔐 Access control
  useEffect(() => {
    if (!user?.email || role !== "EMPLOYER" || !token) {
      alert("❌ Access denied. Please login as an employer.");
      localStorage.clear();
      navigate("/login");
    }
  }, [user, role, token, navigate]);

  // 📦 Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/companies/by-email/${user.email}`);
        setCompany(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("❌ Could not load company data. Please try again.");
      }
    };

    if (user?.email) fetchCompany();
  }, [user?.email]);

  // ✍️ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.put(`/companies/by-email/${user.email}`, company);
      if (res.status === 200 || res.status === 204) {
        setMessage("✅ Company updated successfully.");
      } else {
        setMessage("❌ Failed to update company.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("⚠️ Could not update company. Try again later.");
    }
  };

  
  const styles = {
    container: {
      maxWidth: "700px",
      margin: "40px auto",
      padding: "25px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      fontFamily: "Segoe UI, sans-serif",
    },
    heading: {
      textAlign: "center",
      color: "#0d6efd",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    button: {
      backgroundColor: "#0d6efd",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      width: "100%",
    },
    message: {
      marginTop: "15px",
      textAlign: "center",
      color: "#0d6efd",
      fontWeight: "bold",
    },
  };

  return (
    <>
      <NavbarEmployer />
      <div style={styles.container}>
        <h3 style={styles.heading}>Update Company Details</h3>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={company.companyName}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Industry</label>
          <input
            type="text"
            name="industry"
            value={company.industry}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Location</label>
          <input
            type="text"
            name="location"
            value={company.location}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Update
          </button>
        </form>

        {message && <div style={styles.message}>{message}</div>}
      </div>
    </>
  );
};

export default UpdateCompany;
