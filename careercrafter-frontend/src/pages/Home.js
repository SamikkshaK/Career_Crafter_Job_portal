import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 

const Home = () => {
  return (
    <div className="home-container">
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">CareerCrafter</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      
      <div className="container d-flex justify-content-center">
        <div className="welcome-card text-center col-md-10">
          <h1 className="text-primary">Welcome to Career Crafter</h1>
          <p className="lead">Connecting job seekers and employers on one platform.</p>
          <Link to="/register" className="btn btn-success me-3">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
