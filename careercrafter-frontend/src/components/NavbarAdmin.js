import React from "react";
import { Link } from "react-router-dom";

const NavbarAdmin = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/admin/home">CareerCrafter - Admin</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarUser">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarUser">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/users">Manage Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/jobs">Review All Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/applications">View Applications</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-warning fw-bold" to="/" onClick={() => localStorage.removeItem("user")}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
