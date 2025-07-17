import React from "react";
import { Link } from "react-router-dom";

const NavbarUser = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/user/home">CareerCrafter - Job Seeker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarUser">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarUser">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/browse-jobs">Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manage-profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload-resume">Resume</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-applications">Applications</Link>
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

export default NavbarUser;
