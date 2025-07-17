import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import NavbarMain from "./NavBarMain";

const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", inputs);

      if (res.status === 200) {
        const { token, role } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", inputs.email);

        let userDetails = { email: inputs.email, role };

        // 🔄 Fetch full user data
        if (role === "JOB_SEEKER") {
          const seekerRes = await axios.get(
            `http://localhost:8080/api/jobseekers/by-email/${inputs.email}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          userDetails = seekerRes.data;
        } else if (role === "EMPLOYER") {
          const empRes = await axios.get(
            `http://localhost:8080/api/employers/by-email/${inputs.email}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          userDetails = empRes.data;
        }

        localStorage.setItem("user", JSON.stringify(userDetails));
        setSuccess("Login successful!");

        // 🚀 Redirect based on role
        switch (role) {
          case "EMPLOYER":
            navigate("/employer/home");
            break;
          case "JOB_SEEKER":
            navigate("/user/home");
            break;
          case "ADMIN":
            navigate("/admin/home");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <NavbarMain />
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center text-primary mb-4">Welcome Back! Login</h3>

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {success && <div className="alert alert-success text-center">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={inputs.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={inputs.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">Login</button>
          </form>

          <Link
            to="/register"
            className="btn mt-3"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#fff",
              color: "#007bff",
              border: "2px solid #007bff",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >
            Don’t have an account? Register
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
