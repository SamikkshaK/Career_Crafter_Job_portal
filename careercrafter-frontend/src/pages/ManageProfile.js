import React, { useState } from "react";
import NavbarUser from "../components/NavbarUser";
import api from "../api"; // your axios instance

const ManageProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    education: user?.education || "",
    experience: user?.experience || "",
    resumeLink: user?.resumeLink || ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/jobseekers/${user.id}`, formData); // Token auto-attached

      if (res.status === 200) {
        alert("✅ Profile updated!");
        localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
      } else {
        alert("❌ Failed to update profile.");
        console.error("Server response:", res.data);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile.");
    }
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 0 15px rgba(0,0,0,0.15)",
      fontFamily: "'Segoe UI', sans-serif"
    },
    heading: {
      textAlign: "center",
      color: "#0d6efd",
      marginBottom: "25px",
      fontWeight: "700"
    },
    label: {
      fontWeight: "600",
      marginBottom: "5px",
      display: "block"
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "20px"
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer"
    }
  };

  return (
    <>
      <NavbarUser />
      <div style={styles.container}>
        <h3 style={styles.heading}>Manage Profile</h3>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            style={styles.input}
            disabled
          />

          <label style={styles.label}>Education</label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Resume Link</label>
          <input
            type="text"
            name="resumeLink"
            value={formData.resumeLink}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Update Profile</button>
        </form>
      </div>
    </>
  );
};

export default ManageProfile;
