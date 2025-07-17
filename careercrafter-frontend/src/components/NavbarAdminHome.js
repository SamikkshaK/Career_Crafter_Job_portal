import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarAdminHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const navStyle = {
    backgroundColor: "#0d6efd",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.2rem",
    fontWeight: 600,
  };

  const logoutButton = {
    backgroundColor: "#fff",
    color: "#0d6efd",
    border: "none",
    padding: "6px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background-color 0.3s",
  };

  return (
    <nav style={navStyle}>
      <Link to="/admin/home" style={linkStyle}>
        CareerCrafter - Admin
      </Link>
      <div>
        <span className="me-3">{user?.email}</span>
        <button onClick={handleLogout} style={logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarAdminHome;
