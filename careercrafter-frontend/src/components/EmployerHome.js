import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarEmployerHome from "./NavbarEmployerHome";

const EmployerHome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Redirect to login if no user found
    }
  }, [navigate]);

  const styles = {
    container: {
      backgroundImage: `url("/your-background.jpg")`,
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
    btnPostJob: {
      background: "linear-gradient(to right, #007bff, #0d6efd)",
    },
    btnManage: {
      background: "linear-gradient(to right, #5bc0de, #0dcaf0)",
    },
    btnApplications: {
      background: "linear-gradient(to right, #6ea8fe, #3b77d3)",
    },
  };

  return (
    <>
      <NavbarEmployerHome />
      <div style={styles.container}>
        {user && (
          <div style={styles.card}>
            <h2 style={styles.heading}>Welcome, {user.fullName}!</h2>
            <p style={styles.subtext}>
              You are logged in as <strong>{user.role}</strong>. Manage your postings and applications.
            </p>

            <Link to="/employer/post-job" style={{ ...styles.button, ...styles.btnPostJob }}>
              <i className="fas fa-plus-circle me-2"></i> Post a Job
            </Link>

            <Link to="/employer/manage-job" style={{ ...styles.button, ...styles.btnManage }}>
              <i className="fas fa-tasks me-2"></i> Manage Posted Jobs
            </Link>

            <Link to="/employer/applications" style={{ ...styles.button, ...styles.btnApplications }}>
              <i className="fas fa-folder-open me-2"></i> View Applications
            </Link>

            <Link to="/employer/update-company" style={{ ...styles.button, ...styles.btnApplications }}>
              <i className="fas fa-building me-2"></i> Update Company Details
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployerHome;
