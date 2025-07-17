import React from "react";
import { Link } from "react-router-dom";
import NavbarUserHome from "../components/NavbarUserHome";

const UserHome = () => {
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
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: "40px 30px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
      maxWidth: "600px",
      width: "100%",
      textAlign: "center",
      color: "#212529",
    },
    heading: {
      color: "#0d6efd",
      fontWeight: 700,
      marginBottom: "10px",
    },
    subtext: {
      fontSize: "1.1rem",
      color: "#444",
      marginBottom: "30px",
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
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      border: "none",
    },
    btnJobs: {
      background: "linear-gradient(to right, #007bff, #0d6efd)",
    },
    btnProfile: {
      background: "linear-gradient(to right, #5bc0de, #0dcaf0)",
    },
    btnResume: {
      background: "linear-gradient(to right, #6ea8fe, #3b77d3)",
    },
    btnApplications: {
      background: "linear-gradient(to right, #6699cc, #3366cc)",
    },
  };

  return (
    <>
      <NavbarUserHome />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome, {user?.fullName}!</h2>
          <p style={styles.subtext}>
            You are logged in as <strong>{user?.role}</strong>. Start exploring your opportunities.
          </p>

          <Link to="/browse-jobs" style={{ ...styles.button, ...styles.btnJobs }}>
            <i className="fas fa-briefcase me-2"></i> Browse Jobs
          </Link>

          <Link to="/manage-profile" style={{ ...styles.button, ...styles.btnProfile }}>
            <i className="fas fa-user me-2"></i> Manage Profile
          </Link>

          <Link to="/upload-resume" style={{ ...styles.button, ...styles.btnResume }}>
            <i className="fas fa-file-upload me-2"></i> Upload Resume
          </Link>

          <Link to="/my-applications" style={{ ...styles.button, ...styles.btnApplications }}>
            <i className="fas fa-list-check me-2"></i> View Applications
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserHome;
