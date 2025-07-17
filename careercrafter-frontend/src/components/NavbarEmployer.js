import React from "react";
import { Link } from "react-router-dom";


const NavbarEmployer = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/employer/home">CareerCrafter - Employer</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarEmployer">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarEmployer">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/employer/post-job">Post Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/employer/manage-job">Manage Posted Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/employer/applications">View Applicants</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/employer/update-company">Update Company</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-warning fw-bold" to="/" onClick={() => localStorage.removeItem("Employer")}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarEmployer;
