import React from "react";
import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarAdminHome";

const AdminHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const styles = {
    container: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 15px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      backgroundColor: "#fff",
      padding: "40px 30px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      width: "100%",
      textAlign: "center",
    },
    heading: {
      color: "#0d6efd",
      fontWeight: 700,
      marginBottom: "15px",
    },
    subtext: {
      fontSize: "1.1rem",
      color: "#444",
      marginBottom: "25px",
    },
    button: {
      display: "block",
      margin: "12px auto",
      padding: "12px 25px",
      width: "80%",
      borderRadius: "30px",
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "white",
      textDecoration: "none",
      background: "#0d6efd",
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
    },
  };

  return (
    <>
      <NavbarMain />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome, {user?.fullName || "Admin"}</h2>
          <p style={styles.subtext}>
            You are logged in as <strong>{user?.role}</strong>.
          </p>

          <Link to="/admin/users" style={styles.button}>Manage Users</Link>
          <Link to="/admin/jobs" style={styles.button}>Review All Jobs</Link>
          <Link to="/admin/applications" style={styles.button}>View Applications</Link>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
